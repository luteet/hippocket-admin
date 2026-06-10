import { useState, useCallback } from 'react'
import { useUrlParams } from './useUrlState'

interface UsePaginationOptions {
	count?: number
	/**
	 * When set, the chosen page size is persisted in localStorage under this
	 * key (prefixed) and restored on the next visit. Use a per-page key.
	 */
	storageKey?: string
	/**
	 * When true, `page` and `count` are read from / written to the URL query
	 * (`?page=` is 1-based, `?count=`), so the view is deep-linkable and survives
	 * a reload. When absent, state is local (unchanged behaviour) — keeps
	 * non-list usages (tabs, etc.) working.
	 *
	 * Precedence for page size: `?count=` wins when present and valid, otherwise
	 * the localStorage value, otherwise `count`. Setting the size back to the
	 * default drops `?count=` from the URL.
	 */
	syncToUrl?: boolean
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
	syncToUrl = false,
}: UsePaginationOptions = {}) {
	const [searchParams, setParams] = useUrlParams()

	// Local fallback state, used when not syncing to the URL. In URL mode `page`
	// derives from `?page=`; `count` keeps a local copy too so the fallback (when
	// `?count=` is absent) reflects the latest chosen size, not just page load.
	const [localPage, setLocalPage] = useState(0)
	const [localCount, setLocalCount] = useState(
		() => readStoredCount(storageKey) ?? initialCount,
	)

	let page: number
	if (syncToUrl) {
		const raw = Number(searchParams.get('page'))
		page = Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) - 1 : 0
	} else {
		page = localPage
	}

	let count: number
	if (syncToUrl) {
		const raw = Number(searchParams.get('count'))
		count = PAGE_SIZE_OPTIONS.includes(raw) ? raw : localCount
	} else {
		count = localCount
	}

	const offset = page * count

	const goTo = useCallback(
		(p: number) => {
			const next = Math.max(0, p)
			if (syncToUrl) setParams({ page: next === 0 ? null : next + 1 })
			else setLocalPage(next)
		},
		[syncToUrl, setParams],
	)

	const reset = useCallback(() => {
		if (syncToUrl) setParams({ page: null })
		else setLocalPage(0)
	}, [syncToUrl, setParams])

	/** Change the page size, persist it (if keyed), and return to page one. */
	const setCount = useCallback(
		(c: number) => {
			setLocalCount(c)
			if (storageKey) {
				try {
					localStorage.setItem(STORAGE_PREFIX + storageKey, String(c))
				} catch {
					// ignore write failures (private mode, quota, …)
				}
			}
			if (syncToUrl) {
				// Omit `?count=` when it's the default, to keep the URL clean.
				setParams({ count: c === initialCount ? null : c, page: null })
			} else {
				setLocalPage(0)
			}
		},
		[storageKey, syncToUrl, initialCount, setParams],
	)

	/** Number of pages for a given total record count (at least 1). */
	const pageCount = (total: number) => Math.max(1, Math.ceil(total / count))

	return { page, offset, count, goTo, reset, setCount, pageCount }
}

/** The object returned by `usePagination`. */
export type Pagination = ReturnType<typeof usePagination>
