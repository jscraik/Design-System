"""Attest the Design System pre-push environment against the reviewed contract."""

import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
from datetime import datetime, timezone


ROOT = Path(__file__).resolve().parents[1]
# Only the contract accepted by the preceding validator is admitted here.
CONTRACT_SHA256 = "842b442b041a613a9ad41a0669f72a7906aa6cfa36496b8136dcf8a7da6cbb3b"


def version(command):
    """Read the version from a bounded executable probe."""
    result = subprocess.run(
        command, capture_output=True, text=True, timeout=10, check=True
    )
    match = re.search(r"\b(\d+)\.(\d+)\.(\d+)\b", result.stdout)
    if not match:
        raise ValueError(f"Could not determine {command[0]} version")
    return tuple(int(part) for part in match.groups())


def attestation_path():
    """Admit the fixed output directory without following symlinks."""
    directory = ROOT
    for part in ("artifacts", "policy"):
        directory = directory / part
        if directory.is_symlink():
            raise ValueError(f"Attestation directory is a symlink: {part}")
        directory.mkdir(exist_ok=True)
    path = directory / "environment-attestation.json"
    if path.is_symlink():
        raise ValueError("Attestation file is a symlink")
    path.unlink(missing_ok=True)
    return path


def check():
    """Evaluate the existing approval, sandbox and runtime requirements."""
    path = attestation_path()
    contract_path = ROOT / "harness.contract.json"
    if contract_path.is_symlink() or not contract_path.is_file():
        raise ValueError("Expected a regular repository contract")
    with contract_path.open("rb") as contract_file:
        raw = contract_file.read(1024 * 1024 + 1)
    if hashlib.sha256(raw).hexdigest() != CONTRACT_SHA256:
        raise ValueError("Contract changed from the validated Design System snapshot")
    contract = json.loads(raw)
    pins = {
        item["tool"]: item["version"]
        for item in contract["toolingPolicy"]["requiredMiseTools"]
    }
    python_minimum = tuple(int(part) for part in pins["python"].split(".")) + (0,)
    uv_required = tuple(int(part) for part in pins["uv"].split("."))
    mode = (
        os.environ.get("CLAUDE_SANDBOX_MODE")
        or os.environ.get("CODEX_SANDBOX_MODE")
        or "sandboxed"
    )
    approval = os.environ.get(
        "CLAUDE_APPROVAL_POSTURE", os.environ.get("CODEX_APPROVAL_POSTURE")
    )
    has_approval = approval == "require" or sys.stdin.isatty()
    violations = []
    if mode not in {"sandboxed", "restricted", "isolated"}:
        violations.append({"type": "sandbox_mode_not_allowed"})
    if not has_approval:
        violations.append({"type": "approval_posture_invalid"})
    if version(["python3", "--version"]) < python_minimum:
        violations.append(
            {"type": "runtime_dependency_version_mismatch", "tool": "python"}
        )
    if version(["uv", "--version"]) != uv_required:
        violations.append({"type": "runtime_dependency_version_mismatch", "tool": "uv"})

    policy = {
        key: contract[key]
        for key in ("pilotAuthzPolicy", "pilotRollbackPolicy", "pilotGapCasePolicy")
    }
    fingerprint = hashlib.sha256(
        json.dumps(policy, separators=(",", ":"), ensure_ascii=False).encode()
    ).hexdigest()[:16]
    report = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "policyFingerprint": fingerprint,
        "sandboxMode": mode,
        "hasSecretsFilter": bool(
            os.environ.get(
                "CLAUDE_SECRET_FILTER", os.environ.get("CODEX_SECRET_FILTER")
            )
        )
        or (ROOT / ".env.example").exists(),
        "hasApprovalPosture": has_approval,
        "passed": not violations,
        "violations": violations,
    }
    with tempfile.NamedTemporaryFile(
        mode="w", encoding="utf-8", dir=path.parent, delete=False
    ) as output:
        temporary_path = Path(output.name)
        try:
            json.dump(report, output, indent=2)
            output.close()
            temporary_path.replace(path)
        finally:
            temporary_path.unlink(missing_ok=True)
    print(json.dumps(report, indent=2))
    return int(bool(violations))


if __name__ == "__main__":
    try:
        sys.exit(check())
    except (OSError, ValueError, subprocess.SubprocessError) as error:
        sys.exit(f"Environment validation failed: {error}")
