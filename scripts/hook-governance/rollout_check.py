#!/usr/bin/env python3
"""Evaluate governance rollout freshness from an explicit inventory input."""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def _parse_iso8601(value: str) -> datetime | None:
    candidate = value.strip()
    if not candidate:
        return None
    if candidate.endswith("Z"):
        candidate = candidate[:-1] + "+00:00"
    try:
        parsed = datetime.fromisoformat(candidate)
    except ValueError:
        return None
    if parsed.tzinfo is None:
        return parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc)


def _read_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise SystemExit(f"[rollout_check] inventory not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise SystemExit(f"[rollout_check] invalid JSON in {path}: {exc}") from exc


@dataclass(frozen=True)
class RepoStatus:
    name: str
    path: str
    status: str
    last_validated_at: str
    age_hours: float | None
    stale_reason: str | None


def _extract_repos(inventory: Any) -> list[dict[str, Any]]:
    if isinstance(inventory, dict):
        if "repos" not in inventory:
            raise ValueError("inventory dict is missing required 'repos' key")
        repos = inventory["repos"]
        if not isinstance(repos, list):
            raise ValueError(f"inventory['repos'] must be a list, got {type(repos).__name__}")
    elif isinstance(inventory, list):
        repos = inventory
    else:
        raise ValueError(f"inventory must be a dict or list, got {type(inventory).__name__}")

    for index, repo in enumerate(repos):
        if not isinstance(repo, dict):
            raise ValueError(
                f"inventory repos entry {index} must be an object, got {type(repo).__name__}"
            )
    return repos


def _evaluate_repo(repo: dict[str, Any], now_utc: datetime, recovery_slo_hours: int) -> RepoStatus:
    name = str(repo.get("name") or repo.get("repo") or "(unnamed)")
    path = str(repo.get("path") or repo.get("repo_path") or "")
    status = str(repo.get("status") or "unknown").lower()
    last_validated_at = str(repo.get("last_validated_at") or repo.get("validated_at") or "")
    parsed_ts = _parse_iso8601(last_validated_at)

    stale_reason: str | None = None
    age_hours: float | None = None

    if status in {"failed", "error", "stale"}:
        stale_reason = f"status={status}"
    elif parsed_ts is None:
        stale_reason = "missing_or_invalid_last_validated_at"
    else:
        age_hours = max((now_utc - parsed_ts).total_seconds() / 3600.0, 0.0)
        if age_hours > float(recovery_slo_hours):
            stale_reason = f"age_hours={age_hours:.2f}>slo={recovery_slo_hours}"

    return RepoStatus(
        name=name,
        path=path,
        status=status,
        last_validated_at=last_validated_at,
        age_hours=age_hours,
        stale_reason=stale_reason,
    )


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Check governance rollout freshness from an explicit inventory file."
    )
    parser.add_argument(
        "--inventory",
        required=True,
        help="Path to inventory JSON (required, no default fallback).",
    )
    parser.add_argument(
        "--recovery-slo-hours",
        type=int,
        default=24,
        help="Allowed age window in hours before a repo is considered stale.",
    )
    parser.add_argument(
        "--out",
        required=True,
        help="Path to write JSON report.",
    )
    parser.add_argument(
        "--plain",
        action="store_true",
        help="Run in plain mode (no interactive UI).",
    )
    parser.add_argument(
        "--no-color",
        action="store_true",
        help="Disable colored output.",
    )
    args = parser.parse_args()

    inventory_path = Path(args.inventory).expanduser().resolve()
    out_path = Path(args.out).expanduser().resolve()
    now_utc = datetime.now(timezone.utc)
    inventory = _read_json(inventory_path)
    try:
        repos = _extract_repos(inventory)
    except ValueError as exc:
        print(f"[rollout_check] invalid inventory: {exc}", file=sys.stderr)
        error_report = {
            "generated_at": now_utc.isoformat().replace("+00:00", "Z"),
            "inventory": args.inventory,
            "recovery_slo_hours": args.recovery_slo_hours,
            "summary": {
                "total_repos": 0,
                "stale_repos": 0,
                "pass": False,
            },
            "repos": [],
            "error": str(exc),
        }
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(json.dumps(error_report, indent=2) + "\n", encoding="utf-8")
        return 1

    if not repos:
        raise SystemExit("[rollout_check] inventory contains no repos to validate")
    evaluated = [_evaluate_repo(repo, now_utc, args.recovery_slo_hours) for repo in repos]
    stale = [repo for repo in evaluated if repo.stale_reason is not None]

    report = {
        "generated_at": now_utc.isoformat().replace("+00:00", "Z"),
        "inventory": args.inventory,
        "recovery_slo_hours": args.recovery_slo_hours,
        "summary": {
            "total_repos": len(evaluated),
            "stale_repos": len(stale),
            "pass": len(stale) == 0,
        },
        "repos": [
            {
                "name": repo.name,
                "path": repo.path,
                "status": repo.status,
                "last_validated_at": repo.last_validated_at,
                "age_hours": None if repo.age_hours is None else float(f"{repo.age_hours:.2f}"),
                "stale_reason": repo.stale_reason,
            }
            for repo in evaluated
        ],
    }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

    if stale:
        names = ", ".join(repo.name for repo in stale)
        print(f"[rollout_check] stale repos detected: {names}")
        return 1

    print(f"[rollout_check] pass ({len(evaluated)} repos)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
