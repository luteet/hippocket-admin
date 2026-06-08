// Shared primitives used across the API types.

export type ValueType = 'money' | 'tokens'

// Lightweight option from the reference-data (selects) endpoints, e.g. /refs/partners/.
export interface RefOption {
	id: string
	name: string
}

export interface ApiError {
	// Usually a string; FastAPI validation errors (422) send an array of
	// `{ msg, loc, … }` objects instead.
	detail: string | unknown[]
}

export interface PaginationParams {
	offset: number
	count: number
	search?: string
}
