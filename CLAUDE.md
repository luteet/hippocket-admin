# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Admin panel for Hippocket, a SPA on top of the `/admin-api` REST API. The API is
documented by the Postman files at the repo root
(`collections.json`, `environment.json`) —
treat them as the source of truth for endpoints, payloads, and response shapes.

Status: MVP skeleton. Auth, layout, and the **Partners** and **Referrals**
sections are fully implemented, plus the read-only reference sections
(**Categories / Segments / Locations / Services**) backed by the `/refs/*`
endpoints. **Agents / Groups / Statuses / Withdrawals** are `ComingSoon`
placeholders to be built following the same pattern.

## Commands

```bash
npm run dev      # Vite dev server at http://localhost:5173
npm run build    # tsc -b && vite build  (type-check + production build)
npm run lint     # ESLint
```

There is no test suite. Verify changes with `npm run build` and `npm run lint`
(both must pass), and by running the dev server. Seeing real data requires a
backend at `VITE_API_BASE_URL` (default `http://localhost:8000`, set in `.env`).

### After completing a task: reconcile shell commands with `settings.json`

When a task is done, review the shell commands you ran during the session and
compare them against the `permissions.allow` list in
[.claude/settings.json](.claude/settings.json). If you used any command that
isn't already covered by an existing allow entry, add it (use the `Bash(cmd:*)`
prefix form so future invocations with different args are pre-approved). This
keeps the allowlist current and reduces permission prompts on later runs.

## Testing against the dev API (data-safety rule)

The dev backend (`https://dev-admin.hippocket.com`, see `.env`; admin login in
the git-ignored `.dev-credentials.json`) is backed by a **shared database with
real partner and agent records that have real email addresses**. Mutating them
can trigger real side effects (emails/SMS). When manually testing any request
that **writes** to or otherwise acts on a partner or agent (create/update/delete,
toggle-active, status changes, mark-paid, anything that may notify), only target
**test records**:

- **Partners:** only those with `is_hide: true`. A hidden partner is safe to
  touch; never run write/test requests against a visible (`is_hide: false`)
  partner. The email containing `test` is an extra positive signal.
- **Agents:** only those whose `email` contains `test`.

If no suitable test record exists, create one first (a partner with
`is_hide: true` and a `*test*` email) instead of touching a real record.
Read-only `GET`s against any record are fine.

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
- **Container/hook pattern (component logic lives in a colocated hook):** every
  page/dialog/stateful component keeps its logic in a `use<Component>` hook in a
  sibling file (`useLoginPage.ts`, `usePartnersPage.ts`, `usePartnerForm.ts`,
  `useReferralDetailDialog.ts`, `useAppShell.ts`, …). The component body is then
  just `const { … } = use<Component>()` plus JSX.
    - The hook owns ALL state, effects, data fetching (Query/Mutation), derived
      values, and event handlers; it returns a plain object exposing only what
      the JSX needs (its public interface). Don't leak raw mutation objects —
      return `isDeleting`/`isPending` flags and `handleX`/`goToX` callbacks
      instead of `deleteMut`.
    - Wrap form submits inside the hook: return `onSubmit = handleSubmit(fn)` so
      the component just does `<form onSubmit={onSubmit}>`.
    - Hook files contain NO JSX (keep them `.ts`). JSX-bearing config that's
      pure presentation — TanStack Table `columns` with cell renderers, `Field`
      sub-components — stays in the component file. Schemas, zod-inferred types
      (export them), and constants shared with the JSX live in the hook file and
      are imported by the component.
    - Trivial wrappers with only inline navigation handlers and no real state
      (e.g. `PartnerCreatePage`) don't need a hook.
    - New components MUST follow this pattern.
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
    - **When to move styles to SCSS (large/complex elements):** utilities are the
      default, but when an element's class string grows unwieldy — multiple
      pseudo-classes (`hover:`, `focus-visible:`, `disabled:`…), several
      breakpoints (`md:`/`lg:`/`max-md:`), or just a very long base string —
      give it a semantic class and write the rules in a SCSS partial instead.
        - Partials live in `src/styles/components/_<name>.scss` and are pulled in
          via `@use './components/<name>'` at the top of `main.scss` (keep the
          `./` — Vite's `sass-embedded` won't resolve the bare form in dev).
          Examples: `_input.scss` (`.input`), `_button.scss` (`.button`),
          `_app-shell.scss` (`.shell`, `.sidebar`, `.nav`, …). Unique app-level
          layout pieces go unprefixed; only namespace a class if it'd otherwise
          be ambiguous.
        - **Wrap rules in `@layer components`** so Tailwind utilities still
          override them. Tailwind's `utilities` layer ranks above `components`,
          so a consumer can still pass e.g. `className="pl-9"` and have it win
          over the partial's padding. (Unlayered rules would beat utilities and
          break such overrides — don't do that for component base styles.)
        - **Drive state with `data-` attributes**, not conditional class strings:
          `data-collapsed={collapsed}` / `data-open={open}` on the element, then
          `&[data-collapsed='true'] { … }` in SCSS. React stringifies the boolean
          to `"true"`/`"false"`.
        - **Translate to CSS tokens, not hardcoded colors:** `var(--sidebar)`,
          `color-mix(in srgb, var(--sidebar-foreground) 90%, transparent)` for a
          `/90` opacity, `var(--pill)` for `rounded-pill`, etc. Tailwind spacing
          maps as `n × 0.25rem`; breakpoints are `md = 768px`, `lg = 1024px`.
        - **Variant primitives → base class + `.is-*` modifiers.** For a
          component with variants (was `cva`), drop the `cva` map and give it a
          base class plus modifier classes in the `components` layer; the
          component maps its `variant`/`size` prop to a class. See
          `_button.scss` (`.button` + `.is-secondary`/`.is-ghost`/`.is-sm`/…) and
          [button.tsx](src/components/ui/button.tsx)'s `VARIANT_CLASS`/`SIZE_CLASS`
          lookup. Because the modifiers live in `components`, callers can still
          override with utilities (`AppShell` passes `size-9`, `w-full`,
          `hover:bg-sidebar-accent`). Don't layer a semantic class _on top of_
          `cva` utility output — utilities would beat it; replace the `cva`.
- **Design tokens / light theme only:** colors are CSS variables defined in
  `src/styles/main.scss` and mapped to Tailwind in `@theme inline` in
  `src/index.css`. Palette: background `#F5F5F5`, secondary `#2494AC` (sidebar),
  accent/primary `#DF9033` (buttons/links), border `#CCCCCC`. Font: Readex Pro.
  No dark mode.
- **Icons — SVG sprite + `<Icon>`, no icon library.** All icons come from one
  sprite, `public/img/sprites.svg` (a hidden root `<svg>` of `<symbol id="…">`
  entries, each a 24×24 Lucide glyph with `stroke="currentColor"`). Render them
  through [Icon.tsx](src/components/Icon.tsx):
  `tsx
<Icon name="search" />            // → <svg><use href="/img/sprites.svg#search" /></svg>
<Icon name="loader" className="animate-spin" />
`

    - **Never** import `lucide-react` (it's removed from deps) or hand-write
      inline `<svg>` in components. Use `<Icon>`.
    - `name` is the typed `IconName` union in `Icon.tsx` — the editor
      autocompletes it and rejects typos. Icon ids are kebab-case
      (`arrow-left`, `chevron-down`, `panel-left-open`); the spinner is `loader`,
      the success check is `circle-check`.
    - **Sizing/color match the old Lucide behaviour:** color is inherited
      `currentColor`; size defaults to 24 but any CSS size wins — a `className`
      utility (`size-4`, `size-10`), a semantic class (`.nav-link__icon`), or the
      `.button svg { width: 1rem }` rule inside Buttons. Pass `size-4` etc. just
      like before.
    - **Adding a new icon:** copy the inner nodes from the matching
      [Lucide](https://lucide.dev) glyph into a new
      `<symbol id="kebab-name" viewBox="0 0 24 24" …>` in `sprites.svg` (keep the
      `stroke`/`stroke-width`/`stroke-linecap`/`stroke-linejoin` attrs), then add
      `'kebab-name'` to the `IconName` union in `Icon.tsx`. Keep the two in sync.
    - The path is built from `import.meta.env.BASE_URL`, so it survives a
      non-root Vite `base`. The legacy `public/icons.svg` (social glyphs) is
      unrelated and unused.

- **Pagination:** list endpoints now wrap rows in
  `{ items, total, offset, count }` (see `PartnersData` / `ReferralListData` /
  `StatusData` in [api.ts](src/types/api.ts)) — `total` is the full record count.
  `usePagination` still uses the legacy page-size heuristic (`canNext` =
  `items.length === count`) and ignores `total`; since `total` is now available,
  these pages can be switched to numbered pagination when desired.

## Gotchas

- The local npm cache (`~/.npm`) has root-owned files; run npm with
  `npm_config_cache=/tmp/npm-cache-hp` to avoid `EACCES`.
- `tsconfig` uses TypeScript 6 — `baseUrl` is removed; `paths` resolve without it.
- `verbatimModuleSyntax` is on — use `import type` for type-only imports.
- zod v4: don't use `z.coerce.number()` with the RHF resolver (input type
  mismatch); use `z.number()` + `register(..., { valueAsNumber: true })`.
- shadcn files that export a component plus a `cva` variants object trip
  `react-refresh/only-export-components`; an inline eslint-disable is fine.

## Reference-data (selects) endpoints

The collection's **Reference data (selects)** folder exposes lightweight option
lists (mostly `[{ id, name }]`) for building form selects, so the Partner forms
no longer need raw IDs once wired up:

- `GET /refs/partner-locations/`, `/refs/partner-categories/`,
  `/refs/partner-services/` — options for the partner create/edit form.
- `GET /refs/categories/`, `/refs/groups/`, `/refs/statuses/` — general lookups.

    The read-only reference pages (`src/features/references/`) are one
    parameterized `ReferenceListPage` driven by `REFERENCE_CONFIG[kind]`
    (`useReferenceListPage.ts`), with client-side name search and no pagination
    (these endpoints return a flat `[{ id, name }]` array). The `kind`→endpoint
    map: **Categories** → `/refs/categories/` (granular service categories),
    **Segments** → `/refs/partner-categories/` (broad partner groupings; the
    partner form's `category_id`), **Locations** → `/refs/partner-locations/`,
    **Services** → `/refs/partner-services/`.

- `GET /refs/partners/?limit=500`, `/refs/agents/?limit=200` — partner/agent
  pickers (e.g. referral filters). `/refs/agents/` returns `{ id, email, name }`.

The partner create form's Location / Category / Service fields are wired up as
selects backed by `/refs/partner-locations/`, `/refs/partner-categories/`,
`/refs/partner-services/` (see `RefSelect` in `PartnerForm.tsx` and the
`useReferenceOptions` calls in `usePartnerForm.ts`); `CreatePartnerDto` posts the
selected `location_id` / `category_id` / `service_id`. These are create-only —
they aren't part of the update DTO.

## Open questions for the backend (do not block MVP)

1. `value_type` is `'money' | 'tokens'` — confirmed against the dev API
   (`/partners/` returns both; `tokens` is shown in the UI as "Tokens"). The
   collection examples only show `money`; confirm no further values exist.
2. Withdrawal statuses are `waiting` (initial) → `success` (approve) / `cancel`
   (reject); confirm there are no others.
