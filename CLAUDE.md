# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Admin panel for Hippocket, a SPA on top of the `/admin-api` REST API. The API is
documented by the Postman files at the repo root
(`hippocket_admin.postman_collection.json`, `hippocket_admin.postman_environment.json`) —
treat them as the source of truth for endpoints, payloads, and response shapes.

Status: MVP skeleton. Auth, layout, and two reference sections (**Partners**,
**Referrals**) are fully implemented. **Agents / Groups / Statuses / Withdrawals**
are `ComingSoon` placeholders to be built following the same pattern.

## Commands

```bash
npm run dev      # Vite dev server at http://localhost:5173
npm run build    # tsc -b && vite build  (type-check + production build)
npm run lint     # ESLint
```

There is no test suite. Verify changes with `npm run build` and `npm run lint`
(both must pass), and by running the dev server. Seeing real data requires a
backend at `VITE_API_BASE_URL` (default `http://localhost:8000`, set in `.env`).

## Architecture

- **Stack:** React 19 + Vite + TypeScript, Tailwind v4 + shadcn/ui, TanStack
  Query + Axios, React Router v7, react-hook-form + zod, TanStack Table, motion.
- **Path alias:** `@/` → `src/`.
- **API layer (`src/lib/api/`):** `client.ts` is the shared axios instance with a
  request interceptor (Bearer token) and a response interceptor that does
  single-flight JWT refresh on 401, then retries. On refresh failure it clears
  tokens and emits `AUTH_LOGOUT_EVENT`, which `AuthContext` listens for to log out.
  `auth.ts` (login) and the refresh call use bare axios without interceptors.
  Use `getApiErrorMessage(error)` to surface API errors in toasts.
- **Data layer:** every section has `api.ts` (raw calls) + `hooks.ts` (TanStack
  Query wrappers). Mutations invalidate the section's query key. Follow the
  Partners/Referrals files as the template for new sections.
- **Feature structure:** `src/features/<name>/` holds `api.ts`, `hooks.ts`, the
  page, and dialogs. Shared UI lives in `src/components/` (`DataTable`,
  `ConfirmDialog`, `PageTransition`, `layout/`), shadcn primitives in
  `src/components/ui/`.
- **Routing:** `src/App.tsx` declares all routes. Private routes are wrapped by
  `ProtectedRoute` → `AppShell`. Page transitions use `AnimatePresence` keyed by
  `location.pathname` in `AppShell`.

## Project conventions

- **English everywhere.** All code, comments, docs, and UI-facing strings
  (button labels, toasts, placeholders, nav items) are English. Do not introduce
  Russian text anywhere in the project.
- **Formatting:** Prettier with tabs (width 4), single quotes, no semicolons.
  Run `npm run format` before committing; `npm run format:check` must pass.
- **Styling — Tailwind v4 + SCSS, with a hard constraint:**
    - `src/index.css` is the Tailwind entry (`@import 'tailwindcss'`, `@theme`).
      It MUST stay `.css` — Sass cannot parse Tailwind directives.
    - Custom styles go in SCSS under `src/styles/` (`main.scss`).
    - **Do not use `@apply` in SCSS** — in Tailwind v4 it only resolves in the
      entry CSS, and in `.scss` it leaks through unprocessed. In SCSS, use the
      token CSS variables (`var(--background)`, `var(--border)`, …) directly.
      Apply Tailwind utilities via `className` in components instead.
- **Design tokens / light theme only:** colors are CSS variables defined in
  `src/styles/main.scss` and mapped to Tailwind in `@theme inline` in
  `src/index.css`. Palette: background `#F5F5F5`, secondary `#2494AC` (sidebar),
  accent/primary `#DF9033` (buttons/links), border `#CCCCCC`. Font: Readex Pro.
  No dark mode.
- **Pagination:** the API returns bare arrays with no total count. `usePagination`
  enables "Next" only while a full page is returned (`length === count`). If the
  backend adds `X-Total-Count`, switch to numbered pagination.

## Gotchas

- The local npm cache (`~/.npm`) has root-owned files; run npm with
  `npm_config_cache=/tmp/npm-cache-hp` to avoid `EACCES`.
- `tsconfig` uses TypeScript 6 — `baseUrl` is removed; `paths` resolve without it.
- `verbatimModuleSyntax` is on — use `import type` for type-only imports.
- zod v4: don't use `z.coerce.number()` with the RHF resolver (input type
  mismatch); use `z.number()` + `register(..., { valueAsNumber: true })`.
- shadcn files that export a component plus a `cva` variants object trip
  `react-refresh/only-export-components`; an inline eslint-disable is fine.

## Open questions for the backend (do not block MVP)

1. Total record count for pagination (`X-Total-Count`?).
2. Reference-data endpoints for `locations` / `categories` / `services` (partner
   create form currently takes raw IDs).
3. Full set of `value_type` values and withdrawal statuses.
