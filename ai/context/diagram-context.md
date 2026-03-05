# Diagram Context Pack

Generated: 2026-03-05
Tool: @brainwav/diagram CLI via diagram-cli skill

## Usage for Agents

Reference this file to understand:
- Project structure and component relationships
- Module dependencies and data flows
- Test coverage patterns

## Architecture Overview

### Package Structure

```
packages/
├── ui/              # React component library (main output)
├── tokens/          # Design tokens (CSS variables, Tailwind preset)
├── runtime/         # Host adapters (embedded/standalone)
├── json-render/     # JSON rendering utilities
├── effects/         # Animation/effects library
├── widgets/         # Standalone widget bundles for ChatGPT
├── cli/             # CLI tools
├── astudio-icons/   # Icon library
└── skill-ingestion/ # Skill ingestion utilities

platforms/
├── web/             # Web apps (reference app + Storybook)
├── mcp/             # MCP server for ChatGPT integration
└── desktop/         # Desktop apps (Tauri)
```

### Key Dependencies

| Package | Key Imports |
|---------|-------------|
| ui | @design-studio/tokens, react, @openai/apps-sdk-ui |
| tokens | (standalone - source of truth) |
| runtime | react |
| widgets | @design-studio/tokens/tailwind.preset |
| all packages | vite, vitest, @vitejs/plugin-react |

### Risk Tiers (harness.contract.json)

- **High**: auth widgets, runtime, cloudflare-template, mcp
- **Medium**: ui, tokens, json-render, effects, cli
- **Low**: tests, docs, examples, storybook

## Generated Diagrams

| Diagram | Path | Description |
|---------|------|-------------|
| Architecture | `artifacts/diagrams/architecture.mmd` | Component hierarchy |
| Dependency | `artifacts/diagrams/dependency.mmd` | Import relationships |
| Flow | `artifacts/diagrams/flow.mmd` | Control flow |
| Class | `artifacts/diagrams/class.mmd` | Class relationships |
| Sequence | `artifacts/diagrams/sequence.mmd` | Sequence diagram |

## Manual Refresh

```bash
# Generate diagrams
diagram all . --output-dir .diagram

# Copy to artifacts
cp .diagram/*.mmd artifacts/diagrams/

# Preview
open https://mermaid.live
```
