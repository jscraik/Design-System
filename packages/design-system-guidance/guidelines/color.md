# Color Guidance

## Table of Contents
- [Rule](#rule)
- [Do](#do)
- [Avoid](#avoid)

## Rule
Color choices must use semantic token roles so light/dark/high-contrast modes stay aligned.

## Do
- Use semantic variables such as foreground/background/accent roles.
- Keep color mappings in the token pipeline (brand → alias → mapped).

## Avoid
- Hardcoded hex literals (for example `#fff`, `#121212`) in component styles.
- Bypassing semantic tokens for quick local fixes.
