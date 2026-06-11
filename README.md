# Hippocket Admin

Admin panel for Hippocket — a single-page app on top of the `/admin-api` REST
API. The API is documented by the Postman files at the repo root
(`collections.json`, `environment.json`), which are the source of truth for
endpoints, payloads, and response shapes.

## Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4 + shadcn/ui (component sources live in `src/components/ui`), light theme only
    - Tailwind entry point — `src/index.css` (`@import`/`@theme` directives, must stay `.css`)
    - Custom styles — SCSS partials under `src/styles/` pulled into `main.scss`.
      `@apply` is not used in SCSS (in Tailwind v4 it only resolves in the entry
      CSS); we use the token CSS variables and `@layer components` instead
- TanStack Query + Axios (request interceptor adds the Bearer token; response
  interceptor does single-flight JWT refresh on 401, then retries)
- React Router v7, react-hook-form + zod
- TanStack Table, motion (page transitions)
- Icons: a single SVG sprite (`public/img/sprites.svg`) rendered through
  `<Icon>` — no icon library

## Getting started

```bash
npm install
npm run dev          # dev server at http://localhost:5173
npm run build        # tsc -b + production build (type-check + bundle)
npm run lint         # ESLint
npm run format       # Prettier (tabs, single quotes, no semicolons)
npm run format:check # CI formatting check
```

The API base URL is configured in `.env`:

```
VITE_API_BASE_URL=http://localhost:8000
```

There is no test suite — verify changes with `npm run build` and `npm run lint`
(both must pass) and by running the dev server. Seeing real data requires a
backend at `VITE_API_BASE_URL`.

## Structure

```
src/
  index.css         # Tailwind entry point (@import / @theme)
  styles/           # SCSS: main.scss + components/_*.scss partials (tokens, base, component styles)
  lib/api/          # axios client (Bearer + single-flight auto-refresh), auth, tokens
  lib/queryClient   # TanStack Query setup
  types/api.ts      # TS types derived from the API responses
  features/
    auth/           # LoginPage, AuthContext (useAuth), ProtectedRoute
    search/         # global search / command palette (⌘/Ctrl+K)
    partners/       # CRUD section with inline table editing (richest template)
    referrals/      # list + filters + detail dialog (richest template)
    agents/ groups/ statuses/ withdrawals/ properties/ property-images/
    chats/ aichat/ payments/ contacts/ journey/ saved-filters/
    team-leaders/ cash-offers-emails/ logs/ settings/ references/
  components/
    ui/             # shadcn primitives
    layout/         # AppShell (sidebar), page transitions
    list/           # ListPage shell: SearchInput, FiltersPopover, PageSizeSelect
    form/           # FormLayout + FormFieldRenderer (declarative create/edit forms)
    detail/ media/  # detail-view and media helpers
    DataTable, ConfirmDialog, PageTransition, Field, SwitchField, Icon, …
  hooks/            # usePagination, useSorting, useDebouncedValue, useUrlState, …
```

## Architecture notes

- **Container/hook pattern:** every page/dialog/stateful component keeps its
  logic in a colocated `use<Component>` hook; the component body is just
  `const { … } = use<Component>()` plus JSX.
- **Shared shells:** list pages are built from `src/components/list/` (`ListPage`
    - a list-page hook wiring `usePagination`/`useSorting`/`useDebouncedValue`);
      create/edit forms from `src/components/form/` (`FormLayout` driven by a
      declarative field array). Build a new section by copying the closest existing
      one — Partners and Referrals are the richest templates.
- **URL-synced list state:** search, sort, page, page size, and filters persist
  in the URL query so a view survives reload and can be shared (`syncToUrl` on
  `usePagination`/`useSorting`, `useUrlParams()` for search/filters).
- **Data layer:** every section has `api.ts` (raw calls) + `hooks.ts` (TanStack
  Query wrappers); mutations invalidate the section's query key.

## Status

Past MVP. Authentication, the app layout, a global search / command palette
(⌘/Ctrl+K), and every feature section are implemented on the shared
list/detail/form pattern. There are no remaining `ComingSoon` placeholders. The
read-only **References** pages (Categories / Segments / Locations / Services)
are backed by the `/refs/*` endpoints.

See [CLAUDE.md](CLAUDE.md) for the full architecture guide, conventions, and
data-safety rules when testing against the shared dev API.

## Open questions for the backend

1. `value_type` is `'money' | 'tokens'` (confirmed against the dev API);
   confirm no further values exist.
2. Withdrawal statuses are `waiting` (initial) → `success` (approve) / `cancel`
   (reject); confirm there are no others.
