# Hippocket Admin

Admin panel for Hippocket on top of the `/admin-api` REST API.

## Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4 + shadcn/ui (component sources live in `src/components/ui`), light theme
    - Tailwind entry point — `src/index.css` (`@import`/`@theme` directives, must stay `.css`)
    - Custom styles — SCSS in `src/styles/main.scss` (`:root` tokens, base layer, `card-surface`).
      `@apply` is not used in SCSS (in Tailwind v4 it only works in the entry CSS); we rely on the token CSS variables instead
- TanStack Query + Axios (interceptor with JWT auto-refresh)
- React Router v7, react-hook-form + zod
- TanStack Table, motion (page transitions)

## Getting started

```bash
npm install
npm run dev      # dev server at http://localhost:5173
npm run build    # tsc + production build
npm run lint     # ESLint
```

The API base URL is configured in `.env`:

```
VITE_API_BASE_URL=http://localhost:8000
```

## Structure

```
src/
  index.css       # Tailwind entry point (@import / @theme)
  styles/main.scss # custom styles (SCSS): tokens, base layer, card-surface
  lib/api/        # axios client (Bearer + auto-refresh), auth, tokens
  lib/queryClient # TanStack Query setup
  types/api.ts    # TS types derived from the API example responses
  features/
    auth/         # LoginPage, AuthContext (useAuth), ProtectedRoute
    partners/     # CRUD section (reference)
    referrals/    # list + filters + detail dialog (reference)
  components/
    ui/           # shadcn components
    layout/       # AppShell (sidebar), PageHeader, ComingSoon
    DataTable.tsx # table with offset/count pagination
    PageTransition, ConfirmDialog
  hooks/          # usePagination, useDebouncedValue
```

## Status

The MVP skeleton is implemented: authentication, layout, and two reference
sections — **Partners** and **Referrals**. The Agents / Groups / Statuses /
Withdrawals sections are placeholders (`ComingSoon`) and are added following the
same pattern.

## Open questions for the backend

1. Total record count for pagination (an `X-Total-Count` header?) — for now
   pagination works on the "a full page was returned → show the Next button" rule.
2. Reference-data endpoints `locations` / `categories` / `services` for the
   partner creation form (IDs are currently entered manually).
3. The full set of `value_type` values and withdrawal statuses.
