# Design System Guidance Docs

## Table of Contents
- [Overview](#overview)
- [Package guidelines](#package-guidelines)
- [Rules file](#rules-file)
- [CLI commands](#cli-commands)

## Overview
This package provides guidance checks and an initialization command for consumer repositories.

## Package guidelines
- [Guidelines index](../guidelines/README.md)
- [Getting started](./guidelines/getting-started.md)
- [Rules reference](./guidelines/rules-reference.md)

## Rules file
Machine-readable rules are defined in [`../rules.json`](../rules.json).

## CLI commands
```bash
design-system-guidance init .
design-system-guidance check .
design-system-guidance check . --ci
```
