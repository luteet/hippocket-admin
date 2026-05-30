import {
	createContext,
	useState,
	useCallback,
	useEffect,
	useMemo,
	useContext,
	type ReactNode,
} from 'react'
import { useNavigate } from 'react-router'

import { loginRequest } from '@/lib/api/auth'
import { AUTH_LOGOUT_EVENT } from '@/lib/api/client'
import { queryClient } from '@/lib/queryClient'
import { tokenStore } from '@/lib/api/tokens'

interface AuthContextValue {
	isAuthenticated: boolean
	login: (username: string, password: string) => Promise<void>
	logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(
		() => !!tokenStore.getAccess(),
	)
	const navigate = useNavigate()

	const logout = useCallback(() => {
		tokenStore.clear()
		queryClient.clear()
		setIsAuthenticated(false)
		// Reset the URL to /login so it doesn't linger on the page the user
		// signed out from. The exiting admin view keeps rendering its last
		// route during the fade (AnimatePresence holds the captured element).
		navigate('/login', { replace: true })
	}, [navigate])

	// React to a forced logout from the axios interceptor (refresh failed).
	useEffect(() => {
		const handler = () => logout()
		window.addEventListener(AUTH_LOGOUT_EVENT, handler)
		return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handler)
	}, [logout])

	const login = useCallback(async (username: string, password: string) => {
		const tokens = await loginRequest(username, password)
		tokenStore.set(tokens.access_token, tokens.refresh_token)
		setIsAuthenticated(true)
	}, [])

	const value = useMemo(
		() => ({ isAuthenticated, login, logout }),
		[isAuthenticated, login, logout],
	)

	return <AuthContext value={value}>{children}</AuthContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}
