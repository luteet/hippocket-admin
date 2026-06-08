import axios, {
	AxiosError,
	type AxiosRequestConfig,
	type InternalAxiosRequestConfig,
} from 'axios'

import type { ApiError, TokenPair } from '@/types/api'
import { tokenStore } from './tokens'

export const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

/** Event the auth layer subscribes to in order to redirect to /login. */
export const AUTH_LOGOUT_EVENT = 'hp:auth-logout'

export function emitLogout() {
	window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT))
}

export const api = axios.create({
	baseURL: `${API_BASE_URL}/admin-api`,
	headers: { 'Content-Type': 'application/json' },
})

// Separate instance for refresh — no interceptors, to avoid an infinite loop.
const refreshClient = axios.create({
	baseURL: `${API_BASE_URL}/admin-api`,
	headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
	const token = tokenStore.getAccess()
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

// Single-flight refresh: concurrent 401s wait on one shared refresh.
let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
	const refresh = tokenStore.getRefresh()
	if (!refresh) throw new Error('No refresh token')

	const { data } = await refreshClient.post<TokenPair>('/auth/refresh/', {
		refresh_token: refresh,
	})
	tokenStore.set(data.access_token, data.refresh_token)
	return data.access_token
}

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

api.interceptors.response.use(
	(response) => response,
	async (error: AxiosError<ApiError>) => {
		const original = error.config as RetriableConfig | undefined
		const status = error.response?.status

		const isAuthCall = original?.url?.includes('/auth/')

		if (status === 401 && original && !original._retry && !isAuthCall) {
			original._retry = true
			try {
				if (!refreshPromise) {
					refreshPromise = refreshAccessToken().finally(() => {
						refreshPromise = null
					})
				}
				const newToken = await refreshPromise
				original.headers.Authorization = `Bearer ${newToken}`
				return api(original)
			} catch {
				tokenStore.clear()
				emitLogout()
			}
		}

		return Promise.reject(error)
	},
)

/** A single FastAPI request-validation error (422 responses send an array). */
interface ValidationError {
	msg?: string
	loc?: (string | number)[]
}

/** Extracts a human-readable error message from an API response. `detail` is
 *  usually a string, but FastAPI validation errors (422) send an array of
 *  `{ msg, loc, … }` objects — flatten those to a string so the message is
 *  always safe to render. */
export function getApiErrorMessage(
	error: unknown,
	fallback = 'Something went wrong',
): string {
	if (axios.isAxiosError(error)) {
		const detail = (error.response?.data as ApiError | undefined)?.detail
		if (typeof detail === 'string' && detail) return detail
		if (Array.isArray(detail)) {
			const msg = (detail as ValidationError[])
				.map((d) => d?.msg)
				.filter(Boolean)
				.join('; ')
			if (msg) return msg
		}
		if (error.message) return error.message
	}
	return fallback
}

export type { AxiosRequestConfig }
