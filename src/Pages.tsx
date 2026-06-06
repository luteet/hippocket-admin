import { Fragment, lazy } from 'react'
import {
	Navigate,
	Route,
	Routes,
	useLocation,
	type Location,
} from 'react-router'
import { AnimatePresence, motion } from 'motion/react'

import { useAuth } from '@/features/auth/AuthContext'
import { AppShell } from '@/components/layout/AppShell'
import { NotFound } from '@/components/layout/NotFound'
import { LoginPage } from '@/features/auth/LoginPage'

// Lazy-loaded pages — each becomes its own chunk (code-splitting). LoginPage is
// imported eagerly (above) so the auth boundary can cross-fade without a Suspense
// fallback flashing in mid-transition; it's the entry screen, so it'd load
// up-front anyway. Named exports are adapted to the default export lazy() expects.
const PartnersPage = lazy(() =>
	import('@/features/partners/PartnersPage').then((m) => ({
		default: m.PartnersPage,
	})),
)
const PartnerCreatePage = lazy(() =>
	import('@/features/partners/PartnerCreatePage').then((m) => ({
		default: m.PartnerCreatePage,
	})),
)
const PartnerDetailPage = lazy(() =>
	import('@/features/partners/PartnerDetailPage').then((m) => ({
		default: m.PartnerDetailPage,
	})),
)
const PartnerEditPage = lazy(() =>
	import('@/features/partners/PartnerEditPage').then((m) => ({
		default: m.PartnerEditPage,
	})),
)
const ReferralsPage = lazy(() =>
	import('@/features/referrals/ReferralsPage').then((m) => ({
		default: m.ReferralsPage,
	})),
)
const ReferralDetailPage = lazy(() =>
	import('@/features/referrals/ReferralDetailPage').then((m) => ({
		default: m.ReferralDetailPage,
	})),
)
const ReferralEditPage = lazy(() =>
	import('@/features/referrals/ReferralEditPage').then((m) => ({
		default: m.ReferralEditPage,
	})),
)
const AgentsPage = lazy(() =>
	import('@/features/agents/AgentsPage').then((m) => ({
		default: m.AgentsPage,
	})),
)
const AgentDetailPage = lazy(() =>
	import('@/features/agents/AgentDetailPage').then((m) => ({
		default: m.AgentDetailPage,
	})),
)
const AgentCreatePage = lazy(() =>
	import('@/features/agents/AgentCreatePage').then((m) => ({
		default: m.AgentCreatePage,
	})),
)
const AgentEditPage = lazy(() =>
	import('@/features/agents/AgentEditPage').then((m) => ({
		default: m.AgentEditPage,
	})),
)
const GroupsPage = lazy(() =>
	import('@/features/groups/GroupsPage').then((m) => ({
		default: m.GroupsPage,
	})),
)
const GroupDetailPage = lazy(() =>
	import('@/features/groups/GroupDetailPage').then((m) => ({
		default: m.GroupDetailPage,
	})),
)
const GroupCreatePage = lazy(() =>
	import('@/features/groups/GroupCreatePage').then((m) => ({
		default: m.GroupCreatePage,
	})),
)
const GroupEditPage = lazy(() =>
	import('@/features/groups/GroupEditPage').then((m) => ({
		default: m.GroupEditPage,
	})),
)
const StatusesPage = lazy(() =>
	import('@/features/statuses/StatusesPage').then((m) => ({
		default: m.StatusesPage,
	})),
)
const StatusDetailPage = lazy(() =>
	import('@/features/statuses/StatusDetailPage').then((m) => ({
		default: m.StatusDetailPage,
	})),
)
const StatusCreatePage = lazy(() =>
	import('@/features/statuses/StatusCreatePage').then((m) => ({
		default: m.StatusCreatePage,
	})),
)
const StatusEditPage = lazy(() =>
	import('@/features/statuses/StatusEditPage').then((m) => ({
		default: m.StatusEditPage,
	})),
)
const WithdrawalsPage = lazy(() =>
	import('@/features/withdrawals/WithdrawalsPage').then((m) => ({
		default: m.WithdrawalsPage,
	})),
)
const WithdrawalDetailPage = lazy(() =>
	import('@/features/withdrawals/WithdrawalDetailPage').then((m) => ({
		default: m.WithdrawalDetailPage,
	})),
)
const WithdrawalCreatePage = lazy(() =>
	import('@/features/withdrawals/WithdrawalCreatePage').then((m) => ({
		default: m.WithdrawalCreatePage,
	})),
)
const WithdrawalEditPage = lazy(() =>
	import('@/features/withdrawals/WithdrawalEditPage').then((m) => ({
		default: m.WithdrawalEditPage,
	})),
)
// One parameterized set of pages serves the four partner-taxonomy sections; the
// `kind` prop selects the labels and the `/catalogs/*` endpoint it reads/writes.
const ReferenceListPage = lazy(() =>
	import('@/features/references/ReferenceListPage').then((m) => ({
		default: m.ReferenceListPage,
	})),
)
const ReferenceCreatePage = lazy(() =>
	import('@/features/references/ReferenceCreatePage').then((m) => ({
		default: m.ReferenceCreatePage,
	})),
)
const ReferenceDetailPage = lazy(() =>
	import('@/features/references/ReferenceDetailPage').then((m) => ({
		default: m.ReferenceDetailPage,
	})),
)
const ReferenceEditPage = lazy(() =>
	import('@/features/references/ReferenceEditPage').then((m) => ({
		default: m.ReferenceEditPage,
	})),
)

// The `kind` doubles as the URL segment, so the four CRUD routes are identical
// per section — generate them instead of hand-listing 16 <Route>s.
const REFERENCE_KINDS = [
	'categories',
	'segments',
	'locations',
	'services',
] as const

// The authenticated route tree. `location` is passed explicitly so that while
// this branch is exiting (logout), AnimatePresence keeps rendering the route
// the user was last on instead of following the URL change to /login.
function AppRoutes({ location }: { location: Location }) {
	return (
		<Routes location={location}>
			<Route element={<AppShell />}>
				<Route index element={<Navigate to="/partners" replace />} />
				<Route path="partners" element={<PartnersPage />} />
				<Route path="partners/new" element={<PartnerCreatePage />} />
				<Route path="partners/:id" element={<PartnerDetailPage />} />
				<Route path="partners/:id/edit" element={<PartnerEditPage />} />
				<Route path="referrals" element={<ReferralsPage />} />
				<Route path="referrals/:id" element={<ReferralDetailPage />} />
				<Route
					path="referrals/:id/edit"
					element={<ReferralEditPage />}
				/>
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
				<Route path="agents" element={<AgentsPage />} />
				<Route path="agents/new" element={<AgentCreatePage />} />
				<Route path="agents/:id" element={<AgentDetailPage />} />
				<Route path="agents/:id/edit" element={<AgentEditPage />} />
				<Route path="groups" element={<GroupsPage />} />
				<Route path="groups/new" element={<GroupCreatePage />} />
				<Route path="groups/:id" element={<GroupDetailPage />} />
				<Route path="groups/:id/edit" element={<GroupEditPage />} />
				<Route path="statuses" element={<StatusesPage />} />
				<Route path="statuses/new" element={<StatusCreatePage />} />
				<Route path="statuses/:id" element={<StatusDetailPage />} />
				<Route path="statuses/:id/edit" element={<StatusEditPage />} />
				<Route path="withdrawals" element={<WithdrawalsPage />} />
				<Route
					path="withdrawals/new"
					element={<WithdrawalCreatePage />}
				/>
				<Route
					path="withdrawals/:id"
					element={<WithdrawalDetailPage />}
				/>
				<Route
					path="withdrawals/:id/edit"
					element={<WithdrawalEditPage />}
				/>
				{/* Unknown path: render the 404 inside the shell. */}
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	)
}

// Shared fade for the auth boundary (login ⇄ admin). `mode="wait"` plays the
// exit fully before the enter, so the login screen fades out and only then the
// admin shell fades in (and vice-versa on logout).
const AUTH_FADE = { duration: 0.25, ease: 'easeOut' } as const

export function Pages() {
	const { isAuthenticated } = useAuth()
	const location = useLocation()

	return (
		<AnimatePresence mode="wait">
			{isAuthenticated ? (
				<motion.div
					key="app"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={AUTH_FADE}
				>
					<AppRoutes location={location} />
				</motion.div>
			) : (
				<motion.div
					key="login"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={AUTH_FADE}
				>
					{/* Unauthenticated: only /login exists. Any other path
					    redirects to /login, normalizing the URL and stashing the
					    requested path in state.from so useLoginPage can send the
					    user back there after a successful sign-in. */}
					<Routes location={location}>
						<Route path="/login" element={<LoginPage />} />
						<Route
							path="*"
							element={
								<Navigate
									to="/login"
									replace
									state={{ from: location }}
								/>
							}
						/>
					</Routes>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
