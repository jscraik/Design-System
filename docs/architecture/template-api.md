# Template API

## Contents
- [Overview](#overview)
- [Contracts](#contracts)
- [Verify](#verify)

## Overview

Template APIs define how template metadata, blocks, and renderer props are passed between registry, host, and runtime surfaces.

## Contracts

- Template registry schema: `/Users/jamiecraik/dev/design-system/scripts/schema/template-registry.schema.json`
- Registry tests: `/Users/jamiecraik/dev/design-system/scripts/template-registry-schema.test.mjs`
- Preview resilience tests: `/Users/jamiecraik/dev/design-system/platforms/web/apps/web/tests/template-preview-resilience.test.mjs`

## Verify

- `pnpm test:template-registry`
- `pnpm test:web:property`
