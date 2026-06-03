import { useState, useCallback } from 'react'

interface UsePaginationOptions {
	count?: number
}

/**
 * offset/count pagination. List endpoints return `total` (the full record
 * count), so the page count is `ceil(total / count)` and we render numbered
 * pages. `goTo` jumps to an arbitrary 0-based page.
 */
export function usePagination({ count = 20 }: UsePaginationOptions = {}) {
	const [page, setPage] = useState(0)

	const offset = page * count

	const goTo = useCallback(
		(p: number) => setPage((p2) => Math.max(0, p ?? p2)),
		[],
	)
	const reset = useCallback(() => setPage(0), [])

	/** Number of pages for a given total record count (at least 1). */
	const pageCount = (total: number) => Math.max(1, Math.ceil(total / count))

	return { page, offset, count, goTo, reset, pageCount }
}
