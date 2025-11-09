# AGENTS.md

Use `CLAUDE.md` as the single source of truth for repository context, tooling policies, and links to supporting docs (design, specs, architecture). Always reference it when:
- Spinning up a new agent or handoff script
- Creating prompts that need architectural or design context
- Reconciling product expectations vs. implemented code

`CLAUDE.md` also links to the prompt-ready architecture brief at `agents/architecture.md`—include both when delegating complex work so downstream agents inherit the same constraints.

## Package Manager

This project uses **pnpm** as the default package manager. All commands should use `pnpm` instead of `npm`:
- `pnpm install` to install dependencies
- `pnpm dev` to start the development server
- `pnpm typecheck` to run type checking
- `pnpm lint` to run linting

See [.npmrc](.npmrc:1) for React Native/Expo-specific hoisting configuration.
