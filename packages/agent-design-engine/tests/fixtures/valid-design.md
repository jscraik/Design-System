---
schemaVersion: agent-design.v1
brandProfile: astudio-default@1
---
# Settings Surface

## Surface Roles

This contract defines the shell surface role, section role, row role, state role, and accent role.
The shell owns dynamic viewport and safe-area layout.

## State Model

Loading, empty, and error states must be visible and recoverable.

## Focus Contract

Focus affordances are scoped to components and never implemented as global focus rings.

## Motion Contract

Motion is compositor only and includes reduced-motion fallbacks.

## Component Routing

Check docs/design-system/COMPONENT_LIFECYCLE.json and docs/design-system/COVERAGE_MATRIX.json before creating abstractions.
Use `Stack`, `Flex`, and `SectionHeader` first.

## Tokens

`--color-accent: #123456`
