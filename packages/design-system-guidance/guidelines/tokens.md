# Tokens Guidance

## Table of Contents
- [Rule](#rule)
- [Do](#do)
- [Avoid](#avoid)

## Rule
Use semantic design tokens and CSS variables from your design system package as the source of truth.

## Do
- Import token styles from the canonical package (`@design-studio/tokens` or your mapped equivalent).
- Use mapped token variables in components.

## Avoid
- Hardcoded hex colors.
- Inline brand literals when a semantic token exists.
