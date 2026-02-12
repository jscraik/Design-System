# Troubleshooting Guide

Common errors, their causes, and step-by-step fixes.

---

## Import Errors

### Error: `Cannot find module '@design-studio/ui/base'`

**Cause**: UI package not built

**Fix**:
```bash
pnpm build:lib
```

**Prevention**: Always build after pulling changes

---

### Error: `Module not found: Can't resolve '@openai/apps-sdk-ui/...'`

**Cause**: Dependencies not installed

**Fix**:
```bash
pnpm install
```

**Prevention**: Run `pnpm install` after any dependency changes

---

## Build Errors

### Error: `Type 'X' is not assignable to type 'Y'`

**Cause**: Type mismatch between component props and expected types

**Fix**:
1. Check component prop types in Storybook
2. Verify import path is correct
3. Run `pnpm typecheck` for detailed error

**Prevention**: Use TypeScript strictly; check prop types

---

### Error: `Build failed with 1 error`

**Cause**: Linting or type errors in source

**Fix**:
```bash
# Check lint errors
pnpm lint

# Check type errors
pnpm typecheck

# Auto-fix format issues
pnpm format
```

**Prevention**: Run pre-commit hooks catch these before commit

---

## Development Server Errors

### Error: `Port 5173 is already in use`

**Cause**: Previous dev server still running

**Fix**:
```bash
# Kill process on port
lsof -ti:5173 | xargs kill -9

# Or use different port
pnpm dev --port 5174
```

**Prevention**: Always stop dev server before starting new one

---

### Error: `Cannot GET /dist/index.js (404)`

**Cause**: Running dev server without building first

**Fix**:
```bash
pnpm build:lib && pnpm dev
```

**Prevention**: Build libraries before starting dev server

---

## Test Errors

### Error: `Test failed: Expected X to equal Y`

**Cause**: Test expectations don't match implementation

**Fix**:
1. Read test output to see actual vs expected
2. Update implementation OR fix test
3. Re-run: `pnpm test -- filename`

**Prevention**: Run tests frequently; fix failures promptly

---

### Error: `Cannot find module 'vitest'`

**Cause**: Running test script with wrong working directory

**Fix**:
```bash
# Run from package directory
pnpm -C packages/ui test
```

**Prevention**: Always run tests from correct package context

---

## Widget Errors

### Error: `Widget not appearing in ChatGPT`

**Cause**: Missing build or incorrect manifest

**Fix**:
```bash
# Rebuild widget
pnpm build:widget

# Check output exists
ls -la packages/widgets/dist/
```

**Prevention**: Always verify widget build output before deploying

---

## Token Errors

### Error: `Undefined token '--background-primary'`

**Cause**: Not importing token CSS file

**Fix**:
```tsx
// In your app entry (e.g., main.tsx)
import '@design-studio/tokens/dist/foundations.css';
```

**Prevention**: Always import token CSS in app root

---

## Git Errors

### Error: `Protected branch update failed`

**Cause**: Local main branch is behind remote

**Fix**:
```bash
git fetch origin
git pull origin main
```

**Prevention**: Pull before starting work

---

### Error: `Changeset version mismatch`

**Cause**: Package versions out of sync

**Fix**:
```bash
pnpm sync:versions:check
pnpm sync:versions
```

**Prevention**: Run version sync before releasing

---

## Still Stuck?

Run the diagnostic command:
```bash
pnpm doctor  # or create this script if it doesn't exist
```

Or check CI status locally:
```bash
pnpm lint && pnpm typecheck && pnpm test
```

If all pass, the issue may be environment-specific. Check:
1. Node version: `node --version` (should be 18+)
2. pnpm version: `pnpm --version` (should be 10.28.0)
3. Clean build: `pnpm build:clean && pnpm build:lib`
