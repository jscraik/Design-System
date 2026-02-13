# Release Process

Step-by-step guide for releasing design system packages.

---

## Prerequisites

- Clean working tree (no uncommitted changes)
- Up-to-date main branch
- Write access to `@design-studio` npm packages
- GitHub token for creating PRs

---

## Step 1: Create Changeset

```bash
pnpm changeset
```

1. Select change type (major/minor/patch)
2. Select affected packages
3. Write meaningful change summary

**Example**:
```
? What kind of change is this for @design-studio/ui?
  minor: Added new component, backward compatible
? Which packages would you like to include?
  @design-studio/ui
  @design-studio/tokens
? Please enter a summary for this change:
  Add Modal component with dark mode support
```

This creates `.changeset/NAME.md` files.

---

## Step 2: Commit Changeset

```bash
git add .changeset/*.md
git commit -m "changes: add feature X"
```

**Don't include other changes** in the changeset commit. Keep it atomic.

---

## Step 3: Version Packages

Create a PR for version bumping:

```bash
git checkout -b version-bump
pnpm version-packages
git push origin version-bump
```

This:
- Updates package.json versions
- Generates CHANGELOG.md
- Creates version commit

**Merge this PR** before publishing.

---

## Step 4: Publish to npm

After version bump merges to main:

```bash
git pull origin main
pnpm release
```

This runs `changeset publish` which:
- Builds all packages
- Publishes to npm
- Creates git tags
- Pushes tags to remote

**First publish may require `--no-git-checks` flag.**

---

## Package Access

Design system packages use `restricted` access:
- `@design-studio/ui`
- `@design-studio/tokens`
- etc.

**You must be an org member** to publish these packages.

---

## Version Bump Guidelines

| Type | When | Example |
|-------|--------|---------|
| **Major** | Breaking changes, API redesign | 1.0.0 → 2.0.0 |
| **Minor** | New features, backward compatible | 1.2.0 → 1.3.0 |
| **Patch** | Bug fixes, minor changes | 1.2.0 → 1.2.1 |

---

## Rollback Procedure

If a release breaks things:

### 1. Identify the bad version

```bash
git log --oneline -10
```

### 2. Revert the release commit

```bash
git revert <release-commit-hash>
```

### 3. Bump patch version

```bash
pnpm changeset
# Select "patch" type
```

### 4. Publish hotfix

```bash
# Version and publish
pnpm version-packages
pnpm release
```

### 5. Announce the rollback

Notify team that version X.Y.Z is broken and X.Y.(Z+1) is the fix.

---

## Pre-Release Checklist

- [ ] All tests pass: `pnpm test`
- [ ] Type check passes: `pnpm typecheck`
- [ ] Lint passes: `pnpm lint`
- [ ] Build succeeds: `pnpm build:lib`
- [ ] CHANGELOG.md is accurate
- [ ] Version bump is correct
- [ ] Changesets are in place

---

## Post-Release

1. **Verify on npm**:
   ```bash
   npm view @design-studio/ui
   npm view @design-studio/tokens
   ```

2. **Update dependents**:
   - Run `pnpm install --force` in dependent repos
   - Test integration

3. **Monitor for issues**:
   - Check GitHub Issues for new bug reports
   - Be ready to hotfix if critical issues found

---

## Emergency Hotfix

For critical bugs that can't wait for full release:

```bash
# Create patch changeset directly in main
git checkout main
echo "Hotfix: critical bug fix" > .changeset/hotfix.md
git add .changeset/
git commit -m "changes: hotfix"

# Version and publish (no PR needed for hotfix)
pnpm version-packages
pnpm release
```

Use this sparingly — it bypasses normal review process.
