# Harness Development Makefile
# Run `make help` to see available commands

.PHONY: help install setup preflight worktree-ready verify-work codestyle hooks hooks-pre-commit hooks-commit-msg hooks-pre-push secrets-staged docs-style-changed related-tests semgrep-changed diagrams-check dev build lint docs-lint fmt typecheck test check audit secrets security clean reset ci diagrams env-check

# Default target
help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# === Setup ===

install: ## Install dependencies
	pnpm install

setup: install hooks ## Full setup: install deps and configure git hooks

preflight: ## Run repository preflight checks (required local-memory gate by default)
	@bash ./scripts/codex-preflight.sh

worktree-ready: ## Bootstrap a fresh git worktree before first push
	@bash ./scripts/prepare-worktree.sh

verify-work: ## Run canonical repo-local verification wrapper
	@bash ./scripts/verify-work.sh

codestyle: ## Run fail-closed codestyle validation
	@bash ./scripts/validate-codestyle.sh

hooks: ## Setup git hooks
	node scripts/setup-git-hooks.js

hooks-pre-commit: ## Run local pre-commit gates before creating a commit
	pnpm lint
	pnpm docs:lint
	pnpm typecheck
	$(MAKE) secrets-staged
	$(MAKE) docs-style-changed
	$(MAKE) related-tests

hooks-commit-msg: ## Validate commit message policy
	@if [ -n "$$HOOK_COMMIT_MSG" ]; then \
		tmp_file="$$(mktemp)"; \
		trap 'rm -f "$$tmp_file"' EXIT; \
		printf '%s\n' "$$HOOK_COMMIT_MSG" > "$$tmp_file"; \
		node scripts/validate-commit-msg.js "$$tmp_file"; \
	elif [ -n "$$HOOK_COMMIT_MSG_FILE" ]; then \
		node scripts/validate-commit-msg.js "$$HOOK_COMMIT_MSG_FILE"; \
	elif [ -n "$$MSG_FILE" ]; then \
		node scripts/validate-commit-msg.js "$$MSG_FILE"; \
	else \
		echo "Error: set HOOK_COMMIT_MSG or HOOK_COMMIT_MSG_FILE"; \
		exit 1; \
	fi

hooks-pre-push: ## Run local pre-push governance gates before pushing
	@node ./scripts/check-doc-links.mjs
	@bash ./scripts/check-diagram-freshness.sh
	@bash ./scripts/check-environment.sh
	$(MAKE) semgrep-changed
	$(MAKE) codestyle
	pnpm build

secrets-staged: ## Scan staged content for secrets before committing
	pnpm run secrets:staged

docs-style-changed: ## Run Vale on staged authoritative docs only
	pnpm run docs:style:changed

related-tests: ## Run Vitest related mode for staged src implementation files
	pnpm run test:related

semgrep-changed: ## Run narrow Semgrep rules against changed src implementation files
	pnpm run semgrep:changed

diagrams-check: ## Refresh architecture diagrams when sensitive paths change and fail on drift
	@bash ./scripts/check-diagram-freshness.sh

# === Development ===

dev: ## Start development server
	pnpm dev

build: ## Build for production
	pnpm build

# === Quality ===

lint: ## Run linter
	pnpm lint

docs-lint: ## Lint markdown/docs
	pnpm docs:lint

fmt: ## Format code
	pnpm fmt

typecheck: ## Run TypeScript type checking (excludes packages/effects: pre-existing TS errors)
	pnpm -r --filter '!@design-studio/effects' run type-check

test: ## Run tests
	pnpm test

check: ## Run all required quality gates
	pnpm check

# === Security ===

audit: ## Run security audit
	pnpm audit

secrets: ## Scan for secrets with gitleaks
	@gitleaks detect --source . --verbose || (echo "Install gitleaks: brew install gitleaks" && exit 1)

security: audit secrets ## Run all security checks

# === Maintenance ===

clean: ## Clean build artifacts and caches
	rm -rf dist coverage artifacts .test-traces* .traces
	rm -rf node_modules/.cache

reset: clean ## Full reset: clean and reinstall
	pnpm install

# === CI ===

ci: ## Run CI-equivalent local checks
	pnpm check

# === Diagrams ===

diagrams: ## Generate architecture diagrams
	@bash ./scripts/refresh-diagram-context.sh --force

# === Environment ===

env-check: ## Check environment policy envelope
	@bash ./scripts/check-environment.sh
