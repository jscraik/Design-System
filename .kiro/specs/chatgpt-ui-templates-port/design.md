# Design Document: Port ChatGPT UI Template App into Web Platform (Option A)

Last updated: 2026-01-09

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Design for porting ChatGPT UI templates into the web platform
- Non-scope: Implementation details for unrelated platform features
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Overview

This design specifies the architecture for porting the ChatGPT UI Template App from `_temp/ChatGPT UI Templates` into `platforms/web/apps/web`.

**Registry strategy (Option A)**: The template registry is generated at build time into a typed TS module and imported at runtime.

## Architecture

See full design document provided by user above.

## Correctness Properties

### Property 1: Metadata Completeness
*For any* template in the registry, the template SHALL have complete, schema-valid metadata.
**Validates: Requirements 1.1, 1.5, 2.3**

### Property 2: Registry Determinism
*For any* registry state, running generation twice SHALL produce byte-identical output.
**Validates: Requirements 1.4, 2.1, 11.2**

### Property 3: Unique IDs + Routes
*For any* two templates, their IDs and routes SHALL be unique.
**Validates: Requirement 2.3**

### Property 4: Deep Linking Correctness
*For any* valid template ID, navigating to `/templates?id=<id>` SHALL select that template.
**Validates: Requirement 7.3**

### Property 5: Forbidden Import Boundary
*For any* file under `src/templates/**`, it SHALL NOT import from `@radix-ui/*`.
**Validates: Requirements 4.1, 4.2**

### Property 6: Theme Propagation
*For any* theme change, it SHALL apply consistently via platform theme provider.
**Validates: Requirements 3.3, 3.4, 6.2, 6.4**

### Property 7: Preview Resilience
*For any* template render error, it SHALL be contained by TemplateHost boundary.
**Validates: Requirement 12.1**

### Property 8: External Link Safety
*For any* external link in a template, it SHALL have `rel="noopener noreferrer"`.
**Validates: Requirement 12.4**
