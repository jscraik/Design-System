# Implementation Plan: Port ChatGPT UI Template App (Option A)

## Overview

This implementation plan breaks down the port of the ChatGPT UI Template App into discrete, incremental tasks. Each task builds on previous work and includes validation steps.

## Tasks

- [x] 1. Project setup and dependency audit
  - Audit source app dependencies vs platform dependencies
  - Identify Radix UI packages needed as fallbacks
  - Create dependency reconciliation plan
  - Update `platforms/web/apps/web/package.json` with required dependencies
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 2. Registry generator infrastructure
  - [x] 2.1 Create JSON schema for template metadata
    - Create `scripts/schema/template-registry.schema.json`
    - Define schema for id, title, description, category, tags, status
    - Add validation rules (kebab-case id, valid categories, etc.)
    - _Requirements: 2.2, 2.3_

- [x] 2.2 Write property test for schema validation
    - **Property 1: Metadata Completeness**
    - **Validates: Requirements 1.1, 1.5, 2.3**

- [x] 2.3 Implement registry generator script
    - Create `scripts/generate-template-registry.ts`
    - Implement scan phase (find all `src/templates/**/*.tsx`)
    - Implement parse phase (extract `@template` metadata blocks)
    - Implement validate phase (JSON schema validation)
    - Implement normalize phase (tags lowercase/dedupe/sort)
    - Implement emit phase (generate TypeScript module)
    - Add error handling with actionable messages
    - _Requirements: 1.4, 2.1, 2.4_

- [x] 2.4 Write property test for registry determinism
    - **Property 2: Registry Determinism**
    - **Validates: Requirements 1.4, 2.1, 11.2**

- [x] 2.5 Write property test for unique IDs and routes
    - **Property 3: Unique IDs + Routes**
    - **Validates: Requirement 2.3**

- [x] 2.6 Add registry scripts to package.json
    - Add `registry:generate` script
    - Add `registry:check` script for CI
    - _Requirements: 10.2, 11.2_

- [x] 3. Checkpoint - Verify registry generator
  - Run `pnpm registry:generate` with sample templates
  - Verify generated module compiles
  - Verify determinism (run twice, check no diff)
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Design token integration
- [x] 4.1 Audit source app tokens vs platform tokens
    - Compare `_temp/ChatGPT UI Templates/src/design-tokens.ts` with `packages/tokens`
    - Identify overlapping tokens
    - Identify new tokens needed
    - Create token mapping document
    - _Requirements: 3.1, 3.2, 3.5_

  - [x] 4.2 Merge tokens into packages/tokens
    - Update `packages/tokens/src/tokens/index.dtcg.json`
    - Add new foundation tokens (if needed)
    - Add new semantic tokens (if needed)
    - Ensure no conflicts with existing tokens
    - _Requirements: 3.1, 3.2_

  - [x] 4.3 Generate CSS variables
    - Run token generation: `pnpm -C packages/tokens generate`
    - Verify `packages/tokens/src/foundations.css` updated
    - Verify `packages/tokens/src/tokens.css` updated
    - _Requirements: 3.1, 3.2_

  - [x] 4.4 Write property test for theme propagation
    - **Property 6: Theme Propagation**
    - **Validates: Requirements 3.3, 3.4, 6.2, 6.4**

- [x] 5. Component reconciliation
  - [x] 5.1 Audit source components vs platform components
    - List all components used in source templates
    - Check which exist in `@design-studio/ui`
    - Identify components needing wrappers
    - Identify components to port
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 5.2 Create missing component wrappers in @design-studio/ui
    - Add Radix fallback wrappers to `packages/ui/src/components/ui/`
    - Ensure wrappers consume tokens from `@design-studio/tokens`
    - Export from appropriate `@design-studio/ui` subpaths
    - _Requirements: 4.1, 4.2, 4.4_

- [x] 5.3 Port shared template utilities
    - Create `platforms/web/apps/web/src/components/template-browser/`
    - Port reusable utilities (not full components)
    - Ensure utilities use `@design-studio/ui` components
    - _Requirements: 4.1, 4.2_

- [x] 6. Template browser UI components
- [x] 6.1 Implement TemplateHost wrapper
    - Create `src/components/template-browser/TemplateHost.tsx`
    - Add error boundary with template ID in diagnostics
    - Add consistent padding/sizing
    - Add "Copy Diagnostics" button
    - _Requirements: 5.1, 5.3, 12.1_

  - [x] 6.2 Write property test for preview resilience
    - **Property 7: Preview Resilience**
    - **Validates: Requirement 12.1**

- [x] 6.3 Implement TemplateSearch component
    - Create `src/components/template-browser/TemplateSearch.tsx`
    - Add search input with icon
    - Add clear button
    - Add results count display
    - _Requirements: 5.2_

- [x] 6.4 Implement TemplateSidebar component
    - Create `src/components/template-browser/TemplateSidebar.tsx`
    - Add category grouping with collapse/expand
    - Add template cards with selection state
    - Add category icons and counts
    - Persist collapsed state to localStorage
    - _Requirements: 5.1, 5.4, 9.2, 9.3_

- [x] 6.5 Implement TemplatePreview component
    - Create `src/components/template-browser/TemplatePreview.tsx`
    - Add template header with metadata
    - Add theme toggle control
    - Wrap template in TemplateHost
    - Add empty state for no selection
    - _Requirements: 5.3, 6.1_

- [x] 6.6 Implement TemplateBrowser component
    - Create `src/components/template-browser/TemplateBrowser.tsx`
    - Compose sidebar and preview
    - Wire up search functionality
    - Wire up template selection
    - Import from `@/generated/template-registry`
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 6.7 Write unit tests for search functionality
    - Test search by title
    - Test search by description
    - Test search by tags
    - Test case-insensitive search
    - _Requirements: 5.2_

- [x] 7. Checkpoint - Verify template browser UI
  - Render TemplateBrowser with mock data
  - Test search functionality
  - Test category collapse/expand
  - Test template selection
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Routing integration
- [x] 8.1 Add templates route to Router
    - Update `src/app/Router.tsx`
    - Add `/templates` route
    - Add `/templates?id=<id>` deep linking support
    - Use platform router (React Router/TanStack Router)
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 8.2 Create TemplateBrowserPage
    - Create `src/pages/TemplateBrowserPage.tsx`
    - Read template ID from router params
    - Load theme from platform theme provider
    - Render TemplateBrowser component
    - _Requirements: 7.1, 7.2_

- [x] 8.3 Write property test for deep linking
    - **Property 4: Deep Linking Correctness**
    - **Validates: Requirement 7.3**

- [x] 8.4 Add navigation links
    - Add link from widget gallery to templates
    - Add link from templates to widget gallery
    - _Requirements: 7.5_

  - [x] 8.5 Write integration tests for routing
    - Test navigation to `/templates`
    - Test deep linking with template ID
    - Test navigation between gallery and templates
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 9. Template porting (Phase 1: Core templates)
  - [x] 9.1 Port educational templates
    - Add metadata blocks to each template
    - Update imports to use `@design-studio/ui`
    - Update token usage to use platform tokens
    - Place in `src/templates/educational/`
    - _Requirements: 1.1, 1.5, 4.1, 4.5_

  - [x] 9.2 Port component showcase templates
    - Add metadata blocks
    - Update imports and tokens
    - Place in `src/templates/components/`
    - _Requirements: 1.1, 1.5, 4.1, 4.5_

  - [x] 9.3 Port design system templates
    - Add metadata blocks
    - Update imports and tokens
    - Place in `src/templates/design-system/`
    - _Requirements: 1.1, 1.5, 4.1, 4.5_

  - [x] 9.4 Generate registry with ported templates
    - Run `pnpm registry:generate`
    - Verify generated module compiles
    - Verify templates render in browser
    - _Requirements: 1.4, 2.1_

- [x] 10. Checkpoint - Verify Phase 1 templates
  - Test each ported template renders
  - Test search finds templates
  - Test category grouping works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Template porting (Phase 2: Remaining templates)
  - [ ] 11.1 Port layout templates
    - Add metadata blocks
    - Update imports and tokens
    - Place in `src/templates/layouts/`
    - _Requirements: 1.1, 1.5, 4.1, 4.5_

  - [ ] 11.2 Port modal templates
    - Add metadata blocks
    - Update imports and tokens
    - Place in `src/templates/modals/`
    - _Requirements: 1.1, 1.5, 4.1, 4.5_

  - [ ] 11.3 Port panel templates
    - Add metadata blocks
    - Update imports and tokens
    - Place in `src/templates/panels/`
    - _Requirements: 1.1, 1.5, 4.1, 4.5_

  - [ ] 11.4 Port settings templates
    - Add metadata blocks
    - Update imports and tokens
    - Place in `src/templates/settings/`
    - _Requirements: 1.1, 1.5, 4.1, 4.5_

  - [ ] 11.5 Port full template examples
    - Add metadata blocks
    - Update imports and tokens
    - Place in `src/templates/templates/`
    - _Requirements: 1.1, 1.5, 4.1, 4.5_

  - [ ] 11.6 Generate final registry
    - Run `pnpm registry:generate`
    - Verify all templates included
    - Verify deterministic output
    - _Requirements: 1.4, 2.1, 11.2_

- [ ] 12. CI quality gates
  - [ ] 12.1 Add registry determinism check to CI
    - Create `.github/workflows/template-quality.yml`
    - Add `registry:check` job
    - Fail if generated file has uncommitted changes
    - _Requirements: 11.2_

  - [ ] 12.2 Add import boundary linting
    - Add ESLint rule to forbid `@radix-ui/*` imports in `src/templates/**`
    - Add to CI workflow
    - _Requirements: 4.1, 4.2, 11.4_

  - [ ] 12.3 Write property test for forbidden imports
    - **Property 5: Forbidden Import Boundary**
    - **Validates: Requirements 4.1, 4.2**

  - [ ] 12.4 Add accessibility tests
    - Add axe tests for TemplateBrowserPage
    - Add keyboard navigation tests
    - Add to CI workflow
    - _Requirements: 11.1_

  - [ ] 12.5 Add visual regression tests
    - Add Playwright snapshots for template browser
    - Add snapshots for representative templates
    - Add light/dark theme snapshots
    - Add to CI workflow
    - _Requirements: 11.1_

  - [ ] 12.6 Add performance tests
    - Add bundle size budget check
    - Add search performance test (<100ms for 100 templates)
    - Add route load time test
    - Add to CI workflow
    - _Requirements: 11.3_

- [ ] 13. Security and safety
  - [ ] 13.1 Write property test for external link safety
    - **Property 8: External Link Safety**
    - **Validates: Requirement 12.4**

  - [ ] 13.2 Add HTML sanitization tests
    - Test that user input is sanitized
    - Test that scripts don't execute
    - _Requirements: 12.1, 12.2_

  - [ ] 13.3 Add security audit
    - Check for exposed secrets in logs
    - Check for unsafe external links
    - _Requirements: 12.3, 12.4_

- [ ] 14. Final checkpoint - Complete integration
  - Run full test suite
  - Run all CI checks locally
  - Test all templates render correctly
  - Test search and navigation
  - Test theme switching
  - Test deep linking
  - Verify widget gallery still works
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All tasks are required for comprehensive implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The registry generator is the foundation - complete it first
- Template porting is split into two phases for incremental progress
- CI gates ensure quality is maintained as templates are added
