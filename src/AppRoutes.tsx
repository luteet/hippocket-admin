import { Fragment, lazy, type ComponentType } from 'react'
import { Navigate, Route, Routes, type Location } from 'react-router'

import { AppShell } from '@/components/layout/AppShell'
import { NotFound } from '@/components/layout/NotFound'

// Lazy-loaded pages — each becomes its own chunk (code-splitting). LoginPage is
// imported eagerly (in Pages.tsx) so the auth boundary can cross-fade without a
// Suspense fallback flashing mid-transition; it's the entry screen, so it'd load
// up-front anyway.
//
// `lazyNamed` adapts our named exports to the default export lazy() expects, in
// one line instead of a four-line `.then` per page. The `import('…')` string
// stays a literal argument so Vite can still statically analyse it and split
// each page into its own chunk; the component's prop type is preserved through
// the generic, so e.g. `<ReferenceListPage kind={…} />` stays type-checked.
function lazyNamed<P, K extends string>(
	loader: () => Promise<{ [key in K]: ComponentType<P> }>,
	name: K,
) {
	return lazy(() => loader().then((m) => ({ default: m[name] })))
}

const PartnersPage = lazyNamed(
	() => import('@/features/partners/PartnersPage'),
	'PartnersPage',
)
const PartnerCreatePage = lazyNamed(
	() => import('@/features/partners/PartnerCreatePage'),
	'PartnerCreatePage',
)
const PartnerDetailPage = lazyNamed(
	() => import('@/features/partners/PartnerDetailPage'),
	'PartnerDetailPage',
)
const PartnerEditPage = lazyNamed(
	() => import('@/features/partners/PartnerEditPage'),
	'PartnerEditPage',
)
const ReferralsPage = lazyNamed(
	() => import('@/features/referrals/ReferralsPage'),
	'ReferralsPage',
)
const ReferralDetailPage = lazyNamed(
	() => import('@/features/referrals/ReferralDetailPage'),
	'ReferralDetailPage',
)
const ReferralEditPage = lazyNamed(
	() => import('@/features/referrals/ReferralEditPage'),
	'ReferralEditPage',
)
const AgentsPage = lazyNamed(
	() => import('@/features/agents/AgentsPage'),
	'AgentsPage',
)
const AgentDetailPage = lazyNamed(
	() => import('@/features/agents/AgentDetailPage'),
	'AgentDetailPage',
)
const AgentCreatePage = lazyNamed(
	() => import('@/features/agents/AgentCreatePage'),
	'AgentCreatePage',
)
const AgentEditPage = lazyNamed(
	() => import('@/features/agents/AgentEditPage'),
	'AgentEditPage',
)
const GroupsPage = lazyNamed(
	() => import('@/features/groups/GroupsPage'),
	'GroupsPage',
)
const GroupDetailPage = lazyNamed(
	() => import('@/features/groups/GroupDetailPage'),
	'GroupDetailPage',
)
const GroupCreatePage = lazyNamed(
	() => import('@/features/groups/GroupCreatePage'),
	'GroupCreatePage',
)
const GroupEditPage = lazyNamed(
	() => import('@/features/groups/GroupEditPage'),
	'GroupEditPage',
)
const StatusesPage = lazyNamed(
	() => import('@/features/statuses/StatusesPage'),
	'StatusesPage',
)
const StatusDetailPage = lazyNamed(
	() => import('@/features/statuses/StatusDetailPage'),
	'StatusDetailPage',
)
const StatusCreatePage = lazyNamed(
	() => import('@/features/statuses/StatusCreatePage'),
	'StatusCreatePage',
)
const StatusEditPage = lazyNamed(
	() => import('@/features/statuses/StatusEditPage'),
	'StatusEditPage',
)
const WithdrawalsPage = lazyNamed(
	() => import('@/features/withdrawals/WithdrawalsPage'),
	'WithdrawalsPage',
)
const WithdrawalDetailPage = lazyNamed(
	() => import('@/features/withdrawals/WithdrawalDetailPage'),
	'WithdrawalDetailPage',
)
const WithdrawalCreatePage = lazyNamed(
	() => import('@/features/withdrawals/WithdrawalCreatePage'),
	'WithdrawalCreatePage',
)
const WithdrawalEditPage = lazyNamed(
	() => import('@/features/withdrawals/WithdrawalEditPage'),
	'WithdrawalEditPage',
)
// One parameterized set of pages serves the four partner-taxonomy sections; the
// `kind` prop selects the labels and the `/catalogs/*` endpoint it reads/writes.
const ReferenceListPage = lazyNamed(
	() => import('@/features/references/ReferenceListPage'),
	'ReferenceListPage',
)
const ReferenceCreatePage = lazyNamed(
	() => import('@/features/references/ReferenceCreatePage'),
	'ReferenceCreatePage',
)
const ReferenceDetailPage = lazyNamed(
	() => import('@/features/references/ReferenceDetailPage'),
	'ReferenceDetailPage',
)
const ReferenceEditPage = lazyNamed(
	() => import('@/features/references/ReferenceEditPage'),
	'ReferenceEditPage',
)

// The `kind` doubles as the URL segment, so the four CRUD routes are identical
// per section — generate them instead of hand-listing 16 <Route>s.
const REFERENCE_KINDS = [
	'categories',
	'segments',
	'locations',
	'services',
] as const

// Every top-level section exposes the same CRUD URL shape — list / new / :id /
// :id/edit — so describe each as a config row and generate its routes instead
// of repeating the four <Route>s by hand. `Create` is optional: referrals has
// no create page, so it just omits the `/new` route.
type CrudPages = {
	List: ComponentType
	Create?: ComponentType
	Detail: ComponentType
	Edit: ComponentType
}

const CRUD_SECTIONS: { path: string; pages: CrudPages }[] = [
	{
		path: 'partners',
		pages: {
			List: PartnersPage,
			Create: PartnerCreatePage,
			Detail: PartnerDetailPage,
			Edit: PartnerEditPage,
		},
	},
	{
		path: 'referrals',
		pages: {
			List: ReferralsPage,
			Detail: ReferralDetailPage,
			Edit: ReferralEditPage,
		},
	},
	{
		path: 'agents',
		pages: {
			List: AgentsPage,
			Create: AgentCreatePage,
			Detail: AgentDetailPage,
			Edit: AgentEditPage,
		},
	},
	{
		path: 'groups',
		pages: {
			List: GroupsPage,
			Create: GroupCreatePage,
			Detail: GroupDetailPage,
			Edit: GroupEditPage,
		},
	},
	{
		path: 'statuses',
		pages: {
			List: StatusesPage,
			Create: StatusCreatePage,
			Detail: StatusDetailPage,
			Edit: StatusEditPage,
		},
	},
	{
		path: 'withdrawals',
		pages: {
			List: WithdrawalsPage,
			Create: WithdrawalCreatePage,
			Detail: WithdrawalDetailPage,
			Edit: WithdrawalEditPage,
		},
	},
]

// The four CRUD routes for one section. Returned as a Fragment (not a component)
// because <Routes> reads route config off its direct children's props — a
// wrapper component would hide them.
function crudRoutes(path: string, { List, Create, Detail, Edit }: CrudPages) {
	return (
		<Fragment key={path}>
			<Route path={path} element={<List />} />
			{Create && <Route path={`${path}/new`} element={<Create />} />}
			<Route path={`${path}/:id`} element={<Detail />} />
			<Route path={`${path}/:id/edit`} element={<Edit />} />
		</Fragment>
	)
}

// The authenticated route tree. `location` is passed explicitly so that while
// this branch is exiting (logout), AnimatePresence keeps rendering the route
// the user was last on instead of following the URL change to /login.
export function AppRoutes({ location }: { location: Location }) {
	return (
		<Routes location={location}>
			<Route element={<AppShell />}>
				<Route index element={<Navigate to="/partners" replace />} />
				{CRUD_SECTIONS.map(({ path, pages }) =>
					crudRoutes(path, pages),
				)}
				{REFERENCE_KINDS.map((kind) => (
					<Fragment key={kind}>
						<Route
							path={kind}
							element={<ReferenceListPage kind={kind} />}
						/>
						<Route
							path={`${kind}/new`}
							element={<ReferenceCreatePage kind={kind} />}
						/>
						<Route
							path={`${kind}/:id`}
							element={<ReferenceDetailPage kind={kind} />}
						/>
						<Route
							path={`${kind}/:id/edit`}
							element={<ReferenceEditPage kind={kind} />}
						/>
					</Fragment>
				))}
				{/* Unknown path: render the 404 inside the shell. */}
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	)
}
