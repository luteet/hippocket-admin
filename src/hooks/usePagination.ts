import * as React from 'react'

interface UsePaginationOptions {
	count?: number
}

/**
 * offset/count pagination. The API returns a bare array without a total,
 * so "Next" stays enabled while a full page was returned (lastPageSize === count).
 * If the backend adds X-Total-Count we'll switch to numbered pagination.
 */
export function usePagination({ count = 20 }: UsePaginationOptions = {}) {
	const [page, setPage] = React.useState(0)

	const offset = page * count

	const next = React.useCallback(() => setPage((p) => p + 1), [])
	const prev = React.useCallback(() => setPage((p) => Math.max(0, p - 1)), [])
	const reset = React.useCallback(() => setPage(0), [])

	const hasPrev = page > 0
	const canNext = (lastPageSize: number) => lastPageSize === count

	return { page, offset, count, next, prev, reset, hasPrev, canNext }
}
