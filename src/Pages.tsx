import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'

import { ProtectedRoute } from '@/features/auth/ProtectedRoute'
import { AppShell } from '@/components/layout/AppShell'
import { ComingSoon } from '@/components/layout/ComingSoon'
import { PageFallback } from '@/components/PageFallback'

// Lazy-loaded pages — each becomes its own chunk (code-splitting).
// Named exports are adapted to the default export that lazy() expects.
const LoginPage = lazy(() =>
	import('@/features/auth/LoginPage').then((m) => ({ default: m.LoginPage })),
)
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

export function Pages() {
	return (
		<Suspense fallback={<PageFallback fullScreen />}>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route element={<ProtectedRoute />}>
					<Route element={<AppShell />}>
						<Route
							index
							element={<Navigate to="/partners" replace />}
						/>
						<Route path="partners" element={<PartnersPage />} />
						<Route
							path="partners/new"
							element={<PartnerCreatePage />}
						/>
						<Route
							path="partners/:id"
							element={<PartnerDetailPage />}
						/>
						<Route
							path="partners/:id/edit"
							element={<PartnerEditPage />}
						/>
						<Route path="referrals" element={<ReferralsPage />} />
						<Route
							path="agents"
							element={<ComingSoon title="Agents" />}
						/>
						<Route
							path="groups"
							element={<ComingSoon title="Groups" />}
						/>
						<Route
							path="statuses"
							element={<ComingSoon title="Statuses" />}
						/>
						<Route
							path="withdrawals"
							element={<ComingSoon title="Withdrawals" />}
						/>
					</Route>
				</Route>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</Suspense>
	)
}
