# Guides for common developer tasks

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Start here](#start-here)
- [Documents](#documents)
  - [Development Guides](#development-guides)
  - [Integration Guides](#integration-guides)
  - [Process Guides](#process-guides)
- [Related Documentation](#related-documentation)
- [Additional Resources](#additional-resources)


Use these when you want step-by-step workflows, not API reference.

## Start here

- First time adding a page? Read **PAGES_QUICK_START.md**.
- Shipping? Use **RELEASE_CHECKLIST.md**.

## Documents

### Development Guides

- **[PAGES_QUICK_START.md](./PAGES_QUICK_START.md)** - Quick start guide for creating new pages in the ChatUI system
- **[DESIGN_GUIDELINES.md](./DESIGN_GUIDELINES.md)** - Design system guidelines and best practices
- **[SECURITY_BEST_PRACTICES.md](./SECURITY_BEST_PRACTICES.md)** - Security best practices for deployment and widget development
- **[repo-structure-migration.md](./repo-structure-migration.md)** - Path changes and migration notes for the 2026 restructure

### Integration Guides

- **[CHATGPT_INTEGRATION.md](./CHATGPT_INTEGRATION.md)** - ChatGPT Apps SDK integration guide
- **[CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md)** - Cloudflare Workers deployment guide

### Process Guides

- **[RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md)** - Release process checklist

## Related Documentation

- [Page Development Steering](../../.kiro/steering/page-development.md) - Comprehensive page development guide
- [Component Organization](../../packages/ui/src/components/README.md) - Component structure and usage
- [UI Structure Map](../architecture/ui-structure-map.md) - UI library layout and component foldering map
- [Contributing Guidelines](../../CONTRIBUTING.md) - General contribution guidelines

## Additional Resources

For more detailed development workflows, see:

- Main [README.md](../../README.md) - Project overview and setup
- [Storybook](http://localhost:6006) - Component documentation (when running)
- [Web App](http://localhost:5173) - Reference implementation (when running)
- [Swift Integration](../SWIFT_INTEGRATION.md) - Swift packages and macOS app setup

## Risks and assumptions
- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify
- TBD: Add concrete verification steps and expected results.

## Troubleshooting
- TBD: Add the top 3 failure modes and fixes.

