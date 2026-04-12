#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd -P)"

changed_only=1
fast_mode=0
strict_mode=0
repo_root=""
governance_scope="project-local"
workspace_manifest=""

usage() {
	cat <<'USAGE'
Usage: scripts/verify-work.sh [options]

Canonical repo-local verification runner.

Options:
  --all              Run full test coverage in --fast mode
  --changed-only     Prefer changed-file validation in --fast mode (default)
  --strict           Fail when fast-mode fallbacks are needed
  --fast             Run preflight + lint + typecheck + tests instead of the full check bundle
  --project-governance   Run governance checks in project-local mode (default)
  --workspace-governance Run governance checks using workspace manifest inputs
  --repo-scope-manifest PATH  Override workspace governance manifest path
  --repo-root PATH   Run checks in a specific repository root
  -h, --help         Show this help text
USAGE
}

detect_stack() {
	if [[ -f package.json ]]; then
		echo js
		return
	fi
	if [[ -f pyproject.toml ]]; then
		echo py
		return
	fi
	if [[ -f Cargo.toml ]]; then
		echo rust
		return
	fi
	echo repo
}

preflight_bins_csv() {
	case "$1" in
		js) echo 'git,bash,sed,rg,jq,curl,node,python3,pnpm' ;;
		py) echo 'git,bash,sed,rg,jq,curl,python3' ;;
		rust) echo 'git,bash,sed,rg,jq,curl,python3,cargo' ;;
		repo) echo 'git,bash,sed,rg,jq,curl,python3' ;;
		*) echo "[verify-work] unknown stack: $1" >&2; return 2 ;;
	esac
}

# preflight_paths_csv returns a comma-separated list of repository paths required for preflight verification for the given project stack.
preflight_paths_csv() {
	case "$1" in
		js) echo 'package.json,CODESTYLE.md,CONTRIBUTING.md,Makefile,scripts,scripts/codex-preflight.sh,scripts/codex-preflight-local-memory-legacy.sh,scripts/verify-work.sh,scripts/validate-codestyle.sh' ;;
		py) echo 'pyproject.toml,CODESTYLE.md,CONTRIBUTING.md,Makefile,scripts,scripts/codex-preflight.sh,scripts/codex-preflight-local-memory-legacy.sh,scripts/verify-work.sh,scripts/validate-codestyle.sh' ;;
		rust) echo 'Cargo.toml,CODESTYLE.md,CONTRIBUTING.md,Makefile,scripts,scripts/codex-preflight.sh,scripts/codex-preflight-local-memory-legacy.sh,scripts/verify-work.sh,scripts/validate-codestyle.sh' ;;
		repo) echo 'CODESTYLE.md,CONTRIBUTING.md,Makefile,scripts,scripts/codex-preflight.sh,scripts/codex-preflight-local-memory-legacy.sh,scripts/verify-work.sh,scripts/validate-codestyle.sh' ;;
		*) echo "[verify-work] unknown stack: $1" >&2; return 2 ;;
	esac
}

has_package_script() {
	local script_name="$1"
	[[ -f "$repo_root/package.json" ]] || return 1
	jq -e --arg script_name "$script_name" '(.scripts // {}) | has($script_name)' "$repo_root/package.json" >/dev/null 2>&1
}

resolve_artifact_path() {
	local path="$1"
	if [[ "$path" = /* ]]; then
		echo "$path"
	else
		echo "$repo_root/$path"
	fi
}

write_project_local_governance_inputs() {
	local inventory_path="$1"
	local classification_path="$2"
	local metrics_path="$3"
	local now_utc
	now_utc="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
	local repo_name
	repo_name="$(basename "$repo_root")"

	jq -n \
		--arg generated_at "$now_utc" \
		--arg repo_name "$repo_name" \
		--arg repo_path "$repo_root" \
		'{
			generated_at: $generated_at,
			repos: [
				{
					name: $repo_name,
					path: $repo_path,
					status: "ok",
					last_validated_at: $generated_at
				}
			]
		}' >"$inventory_path"

	jq -n \
		--arg generated_at "$now_utc" \
		'{
			generated_at: $generated_at,
			symbols: []
		}' >"$classification_path"

	jq -n \
		--arg generated_at "$now_utc" \
		'{
			generated_at: $generated_at,
			previous_coverage: 100,
			current_coverage: 100,
			per_symbol: []
		}' >"$metrics_path"
}

run_hook_governance_checks() {
	local rollout_script="$repo_root/scripts/hook-governance/rollout_check.py"
	local docstring_script="$repo_root/scripts/hook-governance/evaluate_docstring_ratchet.py"

	if [[ ! -f "$rollout_script" || ! -f "$docstring_script" ]]; then
		if [[ "${SKIP_GOVERNANCE_CHECKS:-}" == "1" ]]; then
			echo "[verify-work] WARNING: skipping hook-governance checks (scripts missing, SKIP_GOVERNANCE_CHECKS=1)"
			return 0
		fi
		echo "[verify-work] ERROR: hook-governance scripts missing" >&2
		echo "  Expected: $rollout_script" >&2
		echo "  Expected: $docstring_script" >&2
		echo "  Set SKIP_GOVERNANCE_CHECKS=1 to bypass this check" >&2
		exit 1
	fi

	local inventory_path=""
	local classification_path=""
	local metrics_path=""
	local rollout_out=""
	local docstring_out=""

	if [[ "$governance_scope" == "workspace" ]]; then
		local manifest_path="$workspace_manifest"
		if [[ -z "$manifest_path" ]]; then
			manifest_path="$repo_root/docs/hooks-governance/repo-scope.manifest.json"
		fi
		manifest_path="$(resolve_artifact_path "$manifest_path")"
		if [[ ! -f "$manifest_path" ]]; then
			echo "[verify-work] workspace manifest not found: $manifest_path" >&2
			return 2
		fi

		inventory_path="$(jq -r '.inventory // "docs/hooks-governance/repo-profile-matrix.json"' "$manifest_path")"
		classification_path="$(jq -r '.classification // "docs/hooks-governance/public-api-classification.json"' "$manifest_path")"
		metrics_path="$(jq -r '.metrics // "docs/hooks-governance/docstring-ratchet-metrics.json"' "$manifest_path")"
		rollout_out="docs/hooks-governance/rollout-check-report.json"
		docstring_out="docs/hooks-governance/docstring-ratchet-report.json"

		local inventory_path_check
		local classification_path_check
		local metrics_path_check
		inventory_path_check="$(resolve_artifact_path "$inventory_path")"
		classification_path_check="$(resolve_artifact_path "$classification_path")"
		metrics_path_check="$(resolve_artifact_path "$metrics_path")"

		for required_path in "$inventory_path_check" "$classification_path_check" "$metrics_path_check"; do
			if [[ ! -f "$required_path" ]]; then
				echo "[verify-work] workspace governance input not found: $required_path" >&2
				return 2
			fi
		done
	else
		local tmp_dir
		tmp_dir="$(mktemp -d "${TMPDIR:-/tmp}/verify-work-governance.XXXXXX")"
		inventory_path="$tmp_dir/repo-profile-matrix.json"
		classification_path="$tmp_dir/public-api-classification.json"
		metrics_path="$tmp_dir/docstring-ratchet-metrics.json"
		rollout_out="$tmp_dir/rollout-check-report.json"
		docstring_out="$tmp_dir/docstring-ratchet-report.json"
		write_project_local_governance_inputs "$inventory_path" "$classification_path" "$metrics_path"
	fi

	echo
	echo "==> hook-governance rollout-check ($governance_scope)"
	python3 "$rollout_script" \
		--inventory "$inventory_path" \
		--recovery-slo-hours 24 \
		--out "$rollout_out"

	echo
	echo "==> hook-governance docstring-ratchet ($governance_scope)"
	python3 "$docstring_script" \
		--classification "$classification_path" \
		--metrics "$metrics_path" \
		--window-days 14 \
		--out "$docstring_out"
}

while (( $# > 0 )); do
	case "$1" in
		--all|--all-skills)
			changed_only=0
			shift
			;;
		--changed-only)
			changed_only=1
			shift
			;;
		--strict)
			strict_mode=1
			shift
			;;
		--fast)
			fast_mode=1
			shift
			;;
		--project-governance)
			governance_scope="project-local"
			shift
			;;
		--workspace-governance)
			governance_scope="workspace"
			shift
			;;
		--repo-scope-manifest)
			if [[ -z "${2:-}" || "${2:-}" == --* ]]; then
				echo "[verify-work] ERROR: --repo-scope-manifest requires a non-empty value" >&2
				exit 2
			fi
			workspace_manifest="$2"
			shift 2
			;;
		--repo-root)
			repo_root="${2:-}"
			shift 2
			;;
		-h|--help)
			usage
			exit 0
			;;
		*)
			echo "[verify-work] unknown argument: $1" >&2
			usage >&2
			exit 2
			;;
	esac
done

if [[ -z "$repo_root" ]]; then
	repo_root="$REPO_ROOT"
fi

if [[ -n "$workspace_manifest" && "$governance_scope" != "workspace" ]]; then
	echo "[verify-work] ERROR: --repo-scope-manifest is only valid with --workspace-governance" >&2
	exit 2
fi

cd "$repo_root"
echo "[verify-work] repo root: $repo_root"
echo "[verify-work] governance scope: $governance_scope"

stack="$(detect_stack)"
bins_csv="$(preflight_bins_csv "$stack")"
paths_csv="$(preflight_paths_csv "$stack")"

echo
echo "==> codex-preflight"
bash "$repo_root/scripts/codex-preflight.sh" \
	--stack "$stack" \
	--mode required \
	--bins "$bins_csv" \
	--paths "$paths_csv"

run_hook_governance_checks

if [[ "$fast_mode" -eq 0 ]]; then
	echo
	echo "==> validate-codestyle"
	bash "$repo_root/scripts/validate-codestyle.sh" --repo-root "$repo_root"
	exit 0
fi

echo
echo "==> validate-codestyle --fast"
validate_args=(--repo-root "$repo_root" --fast)
if [[ "$changed_only" -eq 1 ]]; then
	validate_args+=(--changed-only)
else
	validate_args+=(--all)
fi
if [[ "$strict_mode" -eq 1 ]]; then
	validate_args+=(--strict)
fi

bash "$repo_root/scripts/validate-codestyle.sh" "${validate_args[@]}"
