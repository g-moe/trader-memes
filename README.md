# Trader Memes

A searchable stash of trader memes for the group chat.

## Run locally

```sh
nvm use
corepack pnpm install
corepack pnpm dev
```

Open the local address shown in the terminal. Meme paths, titles, and tags live in
`apps/web/src/meme-registry.ts`.

## Validate the checkpoint

Install Chromium once, then run the same complete gate used before pushes and in CI:

```sh
corepack pnpm test:e2e:install
corepack pnpm validate
```

The gate checks repository records, linting, formatting, types, unit and browser tests,
at least 90% source coverage, unused code, and the production build.

## Repository

This project uses the `g-moe/.template` pnpm and TypeScript workspace.

- `apps/` contains deployable applications and services.
- `images/` contains the meme library.
- `packages/` contains reusable workspaces if they are needed later.
- `scripts/` contains repository setup and maintenance automation.

Individual checks are also available when diagnosing a failure:

```sh
corepack pnpm test
corepack pnpm coverage
corepack pnpm test:e2e
```
