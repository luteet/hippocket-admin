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

// Server-side sorting (see admin_sorting.md): list endpoints accept `sort_by`
// (a whitelisted column key) and `order`. Sorting is applied before pagination.
export type SortOrder = 'asc' | 'desc'

export interface SortParams {
	sort_by?: string
	order?: SortOrder
}

export interface PaginationParams extends SortParams {
	offset: number
	count: number
	search?: string
	/** Filter by group id(s). Repeated param: ?group_ids=1&group_ids=2 */
	group_ids?: number[]
	/** Filter by partner-category id(s) (UUID). Repeated param. */
	partner_category_ids?: string[]
	/** Filter by service id(s) (UUID). Repeated param. */
	service_ids?: string[]
	/** Filter by location id(s) (UUID). Repeated param. */
	location_ids?: string[]
	/** Filter by category/tag id(s) (UUID, M2M). Repeated param. */
	category_ids?: string[]
}
