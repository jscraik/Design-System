#!/usr/bin/env python3
"""Evaluate docstring coverage ratchet from explicit classification and metrics inputs."""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def _read_json(path: Path, label: str) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise SystemExit(f"[evaluate_docstring_ratchet] {label} not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise SystemExit(f"[evaluate_docstring_ratchet] invalid JSON in {path}: {exc}") from exc


def _is_real_number(value: object) -> bool:
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def _extract_coverage(metrics: Any) -> tuple[float | None, float | None]:
    if not isinstance(metrics, dict):
        raise TypeError(f"metrics must be a dict, got {type(metrics).__name__}")

    previous_candidates = [
        metrics.get("previous_coverage"),
        metrics.get("previous"),
        (metrics.get("coverage") or {}).get("previous")
        if isinstance(metrics.get("coverage"), dict)
        else None,
    ]
    current_candidates = [
        metrics.get("current_coverage"),
        metrics.get("current"),
        (metrics.get("coverage") or {}).get("current")
        if isinstance(metrics.get("coverage"), dict)
        else None,
    ]

    previous = next((float(v) for v in previous_candidates if _is_real_number(v)), None)
    current = next((float(v) for v in current_candidates if _is_real_number(v)), None)
    return (previous, current)


def _extract_per_symbol_regressions(metrics: Any) -> list[dict[str, Any]]:
    if not isinstance(metrics, dict):
        raise TypeError(f"metrics must be a dict, got {type(metrics).__name__}")
    per_symbol = metrics.get("per_symbol", [])
    if not isinstance(per_symbol, list):
        raise TypeError(f"metrics['per_symbol'] must be a list, got {type(per_symbol).__name__}")

    regressions: list[dict[str, Any]] = []
    for idx, row in enumerate(per_symbol):
        if not isinstance(row, dict):
            raise TypeError(f"metrics['per_symbol'][{idx}] must be a dict, got {type(row).__name__}")
        previous = row.get("previous")
        current = row.get("current")
        if not _is_real_number(previous):
            raise TypeError(f"metrics['per_symbol'][{idx}]['previous'] must be numeric, got {type(previous).__name__}")
        if not _is_real_number(current):
            raise TypeError(f"metrics['per_symbol'][{idx}]['current'] must be numeric, got {type(current).__name__}")
        if current < previous:
            regressions.append(
                {
                    "symbol": row.get("symbol") or row.get("name") or "(unknown)",
                    "previous": previous,
                    "current": current,
                    "delta": current - previous,
                }
            )
    return regressions


def _classification_count(classification: Any) -> int:
    if isinstance(classification, dict):
        symbols = classification.get("symbols", [])
        if not isinstance(symbols, list):
            raise TypeError(f"classification['symbols'] must be a list, got {type(symbols).__name__}")
        return len(symbols)
    if isinstance(classification, list):
        return len(classification)
    raise TypeError(f"classification must be a dict or list, got {type(classification).__name__}")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Evaluate docstring ratchet from explicit classification and metrics inputs."
    )
    parser.add_argument(
        "--classification",
        required=True,
        help="Path to public API classification JSON (required, no default fallback).",
    )
    parser.add_argument(
        "--metrics",
        required=True,
        help="Path to docstring metrics JSON (required, no default fallback).",
    )
    parser.add_argument(
        "--window-days",
        type=int,
        default=14,
        help="Reference window for report metadata.",
    )
    parser.add_argument(
        "--out",
        required=True,
        help="Path to write JSON report.",
    )
    args = parser.parse_args()

    classification_path = Path(args.classification).expanduser().resolve()
    metrics_path = Path(args.metrics).expanduser().resolve()
    out_path = Path(args.out).expanduser().resolve()

    classification = _read_json(classification_path, "classification")
    metrics = _read_json(metrics_path, "metrics")

    try:
        previous_coverage, current_coverage = _extract_coverage(metrics)
        regressions = _extract_per_symbol_regressions(metrics)
        classified_count = _classification_count(classification)
    except (ValueError, TypeError) as exc:
        print(f"[evaluate_docstring_ratchet] invalid input: {exc}", file=__import__("sys").stderr)
        error_report = {
            "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "window_days": args.window_days,
            "classification": args.classification,
            "metrics": args.metrics,
            "summary": {
                "classified_symbols": 0,
                "regression_count": 0,
                "pass": False,
            },
            "coverage": {
                "previous": None,
                "current": None,
                "delta": None,
            },
            "regressions": [],
            "error": str(exc),
        }
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(json.dumps(error_report, indent=2) + "\n", encoding="utf-8")
        return 1
    overall_regression = (
        previous_coverage is not None
        and current_coverage is not None
        and current_coverage < previous_coverage
    )

    if overall_regression:
        regressions.insert(
            0,
            {
                "symbol": "__overall__",
                "previous": previous_coverage,
                "current": current_coverage,
                "delta": current_coverage - previous_coverage,
            },
        )

    coverage_complete = previous_coverage is not None and current_coverage is not None
    generated_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    report = {
        "generated_at": generated_at,
        "window_days": args.window_days,
        "classification": args.classification,
        "metrics": args.metrics,
        "summary": {
            "classified_symbols": classified_count,
            "regression_count": len(regressions),
            "coverage_complete": coverage_complete,
            "pass": coverage_complete and len(regressions) == 0,
        },
        "coverage": {
            "previous": previous_coverage,
            "current": current_coverage,
            "delta": None
            if previous_coverage is None or current_coverage is None
            else current_coverage - previous_coverage,
        },
        "regressions": regressions,
    }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

    if not coverage_complete:
        print(
            "[evaluate_docstring_ratchet] coverage metrics missing "
            "(expected previous/current coverage values)"
        )
        return 1

    if regressions:
        print(f"[evaluate_docstring_ratchet] regressions detected: {len(regressions)}")
        return 1

    print("[evaluate_docstring_ratchet] pass")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
