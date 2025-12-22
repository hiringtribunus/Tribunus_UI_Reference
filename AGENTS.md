# Repository Guidelines

## Project Structure & Module Organization
This is a Next.js App Router project. Core routes live in `app/`, with the shared app shell under `app/(app)/`. Global styles and tokens are in `app/globals.css`. Reusable UI and shell components are in `components/` (notably `components/shell/` for layout). Shared utilities live in `lib/` (for example, `lib/cn.ts`), and hooks are in `hooks/`. Documentation and feature specs live in `Docs/`.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start the local dev server at `http://localhost:3000`.
- `npm run build`: create a production build.
- `npm run start`: run the production server locally.
- `npm run lint`: run Next.js ESLint checks.

## Coding Style & Naming Conventions
Use TypeScript, Tailwind CSS, and shadcn/ui patterns. Prefer functional React components and keep code modular and junior-friendly. Follow existing file naming (PascalCase for components like `AppShell.tsx`, camelCase for utilities like `cn.ts`). Indentation and formatting should match surrounding code; run `npm run lint` before PRs. UI decisions must align with `Docs/STYLE_GUIDE.md`.

## Testing Guidelines
No automated test suite is configured yet. For changes, validate behavior in the dev server and run `npm run lint`. If you add temporary test code to verify a change, remove it after verification as required by `Docs/PROMPT_TEMPLATE.md`.

## Commit & Pull Request Guidelines
There is no commit history yet, so no established commit message convention. Use Conventional Commits moving forward (e.g., `feat: add projects grid`, `fix: correct nav focus state`). PRs should include a short description, linked issue (if applicable), and screenshots or a short screen recording for UI changes.

## Agent-Specific Instructions
Follow the rules in `Docs/PROMPT_TEMPLATE.md` (read relevant docs fully, keep comments minimal, stay on the approved tech stack). For design decisions, reference `Docs/STYLE_GUIDE.md`.
