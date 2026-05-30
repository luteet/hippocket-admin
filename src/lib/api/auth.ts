import axios from 'axios'

import type { TokenPair } from '@/types/api'
import { API_BASE_URL } from './client'

// Login uses a bare axios instance without interceptors (auth: noauth in the collection).
export async function loginRequest(
	username: string,
	password: string,
): Promise<TokenPair> {
	const { data } = await axios.post<TokenPair>(
		`${API_BASE_URL}/admin-api/auth/login/`,
		{ username, password },
		{ headers: { 'Content-Type': 'application/json' } },
	)
	return data
}
