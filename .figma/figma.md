# Figma Integration

Last updated: 2026-01-09

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


This project uses Figma Code Connect to link Figma designs with React components.

## Setup

1. Install Figma Code Connect CLI (already installed globally):
```bash
npm install -g @figma/code-connect
```

2. Configure your Figma access token:
```bash
figma auth login
```

3. Link your Figma file:
```bash
figma connect <file-url>
```

## Usage

### View Figma connections
```bash
figma connect
```

### Validate connections
```bash
pnpm figma:validate
```

### Sync components
```bash
pnpm figma:sync
```

## FigmaConnect Files

Each template component has a corresponding `.figmaConnect.tsx` file that maps:
- Figma component → React component
- Figma variants → React props
- Figma instances → Storybook stories

## File Structure

```
packages/ui/src/templates/
├── ChatFullWidthTemplate.tsx           # React component
├── ChatFullWidthTemplate.figmaConnect.tsx  # Figma mapping
└── ChatFullWidthTemplate.stories.tsx   # Storybook stories
```

## Design Tokens

Design tokens are managed in `packages/tokens/` and should match Figma variables.
