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

## Repository

This project uses the `g-moe/.template` pnpm and TypeScript workspace.

- `apps/` contains deployable applications and services.
- `images/` contains the meme library.
- `packages/` contains reusable workspaces if they are needed later.
- `scripts/` contains repository setup and maintenance automation.

Useful checks:

```sh
corepack pnpm check
corepack pnpm coverage
corepack pnpm build
```
