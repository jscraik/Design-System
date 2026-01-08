# Documentation index for developers

Last updated: 2026-01-07

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: Docs Maintainers (confirm)
- Review cadence: Quarterly (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Directory structure](#directory-structure)
- [Start here](#start-here)
- [Documentation quality checks](#documentation-quality-checks)
- [Architecture docs](#architecture-docs)
- [Audit reports](#audit-reports)
- [Guides](#guides)
- [Root documentation](#root-documentation)
- [Workflow docs](#workflow-docs)

This index helps you find the right doc fast. Start here, then jump into the category you need.

## Directory structure

```
docs/
├── architecture/    # System design and architecture documents
├── audits/          # Design system audits and compliance reports
├── guides/          # How-to guides and quick starts
├── features/        # Feature design specs and parity notes
├── foundations/     # Source reference materials (PDFs, specs)
└── work/            # Work logs, audits, and validation notes
```

## Start here

- New to the repo? Read the root [README.md](../README.md) first.
- Working on Swift? Start with [SWIFT_INTEGRATION.md](./SWIFT_INTEGRATION.md).
- Releasing? Use [RELEASE_CHECKLIST.md](./guides/RELEASE_CHECKLIST.md).
- Looking for the CLI? See [packages/cli/README.md](../packages/cli/README.md).

## Documentation quality checks

Run documentation checks from the repo root:

```bash
pnpm doc:lint
```

Requirements:

- Vale installed locally (e.g., `brew install vale`).
- `pnpm install` completed so repo scripts are available.

## Architecture docs

Technical architecture and design decisions.

- **[WIDGET_ARCHITECTURE.md](./architecture/WIDGET_ARCHITECTURE.md)** - Widget system architecture
- **[repo-map.md](./architecture/repo-map.md)** - High-level repository map
- **[ui-structure-map.md](./architecture/ui-structure-map.md)** - UI library layout and component foldering map
- **[APPS_SDK_GAP_ANALYSIS.md](./architecture/APPS_SDK_GAP_ANALYSIS.md)** - Apps SDK integration analysis
- **[CROSS_PLATFORM.md](./architecture/CROSS_PLATFORM.md)** - Cross-platform architecture notes (legacy context included)
- **[WIDGET_SYSTEM_ENHANCEMENTS.md](./architecture/WIDGET_SYSTEM_ENHANCEMENTS.md)** - Widget infrastructure enhancements
- **[template-library.md](./architecture/template-library.md)** - Template library layout and parity rules
- **[template-api.md](./architecture/template-api.md)** - Template and block API (internal)

## Audit reports

Design system compliance audits and color reference documentation.

- **[APPS_SDK_COMPLIANCE_AUDIT.md](./audits/APPS_SDK_COMPLIANCE_AUDIT.md)** - Apps SDK compliance audit
- **[COLOR_AUDIT_COMPLETE.md](./audits/COLOR_AUDIT_COMPLETE.md)** - Complete color system audit
- **[COLOR_REFERENCE.md](./audits/COLOR_REFERENCE.md)** - Color palette reference
- **[DESIGN_AUDIT_REPORT.md](./audits/DESIGN_AUDIT_REPORT.md)** - Overall design audit report
- **[TEXT_COLOR_AUDIT_SUMMARY.md](./audits/TEXT_COLOR_AUDIT_SUMMARY.md)** - Text color usage audit

## Guides

Step-by-step guides for common tasks.

- **[PAGES_QUICK_START.md](./guides/PAGES_QUICK_START.md)** - Quick start guide for creating pages
- **[DESIGN_GUIDELINES.md](./guides/DESIGN_GUIDELINES.md)** - UI design and accessibility guidelines
- **[UI_COMPONENT_TOOLING.md](./guides/UI_COMPONENT_TOOLING.md)** - UI component tooling and QA sequence
- **[CHATGPT_INTEGRATION.md](./guides/CHATGPT_INTEGRATION.md)** - Connect an MCP server to ChatGPT
- **[CLOUDFLARE_DEPLOYMENT.md](./guides/CLOUDFLARE_DEPLOYMENT.md)** - Deploy widgets to Cloudflare Workers
- **[repo-structure-migration.md](./guides/repo-structure-migration.md)** - Path changes from the 2026 restructure
- **[RELEASE_CHECKLIST.md](./guides/RELEASE_CHECKLIST.md)** - Release checklist

## Root documentation

Key project documentation remains at the repository root:

- **[README.md](../README.md)** - Project overview and getting started
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - Contribution guidelines
- **[CHANGELOG.md](../CHANGELOG.md)** - Version history
- **[SECURITY.md](../SECURITY.md)** - Security policies
- **[ATTRIBUTIONS.md](../ATTRIBUTIONS.md)** - Third-party attributions
- **[AGENTS.md](../AGENTS.md)** - AI agent system instructions

## Workflow docs

- **[BUILD_PIPELINE.md](./BUILD_PIPELINE.md)** - Build pipeline architecture and usage
- **[VERSION_SYNC.md](./VERSION_SYNC.md)** - Version synchronization across packages
- **[SWIFT_INTEGRATION.md](./SWIFT_INTEGRATION.md)** - Swift package and macOS app integration
