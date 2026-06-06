import { useState, useCallback } from 'react'

interface UsePaginationOptions {
	count?: number
	/**
	 * When set, the chosen page size is persisted in localStorage under this
	 * key (prefixed) and restored on the next visit. Use a per-page key.
	 */
	storageKey?: string
}

/** Page-size options offered by the "N per page" selectors. */
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

const STORAGE_PREFIX = 'pagination:count:'

/** Read a persisted, valid page size, or `null` if absent/unusable. */
function readStoredCount(storageKey: string | undefined): number | null {
	if (!storageKey) return null
	try {
		const raw = localStorage.getItem(STORAGE_PREFIX + storageKey)
		const value = raw == null ? NaN : Number(raw)
		return PAGE_SIZE_OPTIONS.includes(value) ? value : null
	} catch {
		return null
	}
}

/**
 * offset/count pagination. List endpoints return `total` (the full record
 * count), so the page count is `ceil(total / count)` and we render numbered
 * pages. `goTo` jumps to an arbitrary 0-based page.
 */
export function usePagination({
	count: initialCount = 20,
	storageKey,
}: UsePaginationOptions = {}) {
	const [page, setPage] = useState(0)
	const [count, setCountState] = useState(
		() => readStoredCount(storageKey) ?? initialCount,
	)

	const offset = page * count

	const goTo = useCallback(
		(p: number) => setPage((p2) => Math.max(0, p ?? p2)),
		[],
	)
	const reset = useCallback(() => setPage(0), [])

	/** Change the page size, persist it (if keyed), and return to page one. */
	const setCount = useCallback(
		(c: number) => {
			setCountState(c)
			setPage(0)
			if (storageKey) {
				try {
					localStorage.setItem(STORAGE_PREFIX + storageKey, String(c))
				} catch {
					// ignore write failures (private mode, quota, …)
				}
			}
		},
		[storageKey],
	)

	/** Number of pages for a given total record count (at least 1). */
	const pageCount = (total: number) => Math.max(1, Math.ceil(total / count))

	return { page, offset, count, goTo, reset, setCount, pageCount }
}

/** The object returned by `usePagination`. */
export type Pagination = ReturnType<typeof usePagination>
