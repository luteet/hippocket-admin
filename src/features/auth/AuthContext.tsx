import * as React from 'react'

import { loginRequest } from '@/lib/api/auth'
import { AUTH_LOGOUT_EVENT } from '@/lib/api/client'
import { queryClient } from '@/lib/queryClient'
import { tokenStore } from '@/lib/api/tokens'

interface AuthContextValue {
	isAuthenticated: boolean
	login: (username: string, password: string) => Promise<void>
	logout: () => void
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = React.useState(
		() => !!tokenStore.getAccess(),
	)

	const logout = React.useCallback(() => {
		tokenStore.clear()
		queryClient.clear()
		setIsAuthenticated(false)
	}, [])

	// React to a forced logout from the axios interceptor (refresh failed).
	React.useEffect(() => {
		const handler = () => logout()
		window.addEventListener(AUTH_LOGOUT_EVENT, handler)
		return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handler)
	}, [logout])

	const login = React.useCallback(
		async (username: string, password: string) => {
			const tokens = await loginRequest(username, password)
			tokenStore.set(tokens.access_token, tokens.refresh_token)
			setIsAuthenticated(true)
		},
		[],
	)

	const value = React.useMemo(
		() => ({ isAuthenticated, login, logout }),
		[isAuthenticated, login, logout],
	)

	return <AuthContext value={value}>{children}</AuthContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
	const ctx = React.useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}
