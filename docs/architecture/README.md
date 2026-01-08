# Architecture Documentation

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


Technical architecture and design decisions for the ChatUI system.

## Table of contents

- [Documents](#documents)
- [Related documentation](#related-documentation)

## Documents

### Core Architecture

- **[repo-map.md](./repo-map.md)** - High-level map of the repository structure
- **[WIDGET_ARCHITECTURE.md](./WIDGET_ARCHITECTURE.md)** - Widget system architecture, build system, and ChatGPT integration patterns
- **[CROSS_PLATFORM.md](./CROSS_PLATFORM.md)** - Cross-platform architecture and design decisions
- **[WIDGET_SYSTEM_ENHANCEMENTS.md](./WIDGET_SYSTEM_ENHANCEMENTS.md)** - Enhanced widget infrastructure implementation details

### Analysis & Planning

- **[APPS_SDK_GAP_ANALYSIS.md](./APPS_SDK_GAP_ANALYSIS.md)** - Analysis of gaps between Apps SDK UI and ChatGPT design system requirements

### Templates

- **[template-library.md](./template-library.md)** - Template library layout, parity rules, and viewing checklist
- **[template-api.md](./template-api.md)** - Internal template/block API and registries

## Related Documentation

- [Component Organization](../../packages/ui/src/components/README.md)
- [Page Development Guide](../../.kiro/steering/page-development.md)
