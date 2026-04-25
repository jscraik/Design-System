# JSC-225 Simplify Review

## Scope

- Diff: generated build-output and Storybook screenshot de-indexing, artifact
  contract docs, cleanup inventory update, and `FORJAMIE.md` update.
- Mode: inline simplify review after one delegated reviewer returned an invalid
  handoff instead of an artifact.

## Findings

No blocking simplify findings.

## Review Notes

- The broad deletion set is intentionally limited to files already matched by
  `.gitignore` as generated output.
- The contract doc keeps the source of truth small: source files, package
  manifests, workflows, Playwright baselines, CI artifacts, and Argos
  comparisons.
- The repo still has 112 tracked ignored files after this slice, but they are
  planning, editor, Vale, transcript, Codex, and spec surfaces rather than the
  `dist/**` or Storybook screenshot families covered by JSC-225.
- Keeping package `dist` paths in `main`, `types`, `exports`, `bin`, and
  `files` is acceptable because publish workflows build before pack/publish.

## Residual Risk

Local commands that directly execute `node packages/*/dist/...` still require a
prior package build. That is now explicit in the JSC-225 contract and
`FORJAMIE.md`.

## Validation Evidence

- `pnpm format:check` passed.
- `pnpm docs:lint` passed.
- `pnpm build` passed when run outside the macOS sandbox so Playwright Chromium
  could launch.
- `git diff --check` passed.
- `git ls-files -ci --exclude-standard | rg '(^|/)dist/|^platforms/web/apps/storybook/screenshots/'`
  returned zero matches.

WROTE: artifacts/reviews/jsc225-simplify-review.md
