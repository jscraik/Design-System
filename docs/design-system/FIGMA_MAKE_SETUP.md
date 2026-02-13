# Figma Make Registry Setup

This guide describes how to configure the Figma org private npm registry for the `@design-studio/*` packages used by Figma Make.

## Registry configuration

1. Generate an admin token in the Figma Make settings for your org.
2. Copy `.npmrc.figma.template` to `.npmrc` in the repository root or your user home directory.
3. Replace `<AUTH_TOKEN>` with the generated token.

Example:

    @astudio:registry=https://npm.figma.com/
    //npm.figma.com/:_authToken=YOUR_TOKEN

## Secrets and CI

- Store the token in GitHub Actions as `FIGMA_NPM_TOKEN` (or update the workflow secret name if you choose a different key).
- Do not commit real tokens to the repository.

## Publishing

Publishing is handled by `.github/workflows/publish-astudio.yml` on release tags or manual dispatch. The workflow writes a temporary `.npmrc` file for the Figma registry using the secret token.

## Troubleshooting

- If `npm publish` fails with 401/403, confirm the token scope and that the registry URL is `https://npm.figma.com/`.
- If packages are not visible in Make, ensure the version was published and that the Make file installs all three packages.
