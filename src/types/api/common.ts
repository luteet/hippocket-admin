// Shared primitives used across the API types.

export type ValueType = 'money' | 'tokens'

// Lightweight option from the reference-data (selects) endpoints, e.g. /refs/partners/.
export interface RefOption {
	id: string
	name: string
}

export interface ApiError {
	detail: string
}

export interface PaginationParams {
	offset: number
	count: number
	search?: string
}
