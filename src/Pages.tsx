import { useLocation } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'

import { useAuth } from '@/features/auth/AuthContext'
import { LoginPage } from '@/features/auth/LoginPage'
import { AppRoutes } from '@/AppRoutes'

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
					{/* Unauthenticated: the login screen lives at the root path
					    (and renders regardless of the current URL). Signing in
					    flips isAuthenticated, so this swaps to the admin shell in
					    place — no redirect; whatever path is in the URL is then
					    rendered by AppRoutes. */}
					<LoginPage />
				</motion.div>
			)}
		</AnimatePresence>
	)
}
