import { useState, useCallback } from 'react'
import type { SortOrder } from '@/types/api'
import { useUrlParams } from './useUrlState'

interface UseSortingOptions {
	/**
	 * The column the list is sorted by initially — should match the endpoint's
	 * server-side default (see admin_sorting.md). Shown with its arrow on first
	 * render so the user sees what drives the order.
	 */
	defaultSortBy?: string
	/** Initial direction for {@link defaultSortBy}. Defaults to `'asc'`. */
	defaultOrder?: SortOrder
	/**
	 * When true, the sort lives in the URL (`?sort=` / `?order=`) so it's
	 * deep-linkable and survives a reload. The default/"off" state omits both
	 * keys (clean URL → falls back to the endpoint's default ordering). Toggling
	 * also resets `?page=` in the same write. When absent, state is local
	 * (unchanged behaviour).
	 */
	syncToUrl?: boolean
}

/**
 * Server-side column sorting state for a list page. Clicking a header cycles
 * that column asc → desc → off (back to the endpoint's default). The page feeds
 * `sortBy`/`order` into its query params and wires `toggle` to the table.
 *
 * `sortBy`/`order` are `undefined` in the "off" state: the request then omits
 * both params and the backend applies its own default ordering.
 */
interface SortState {
	sortBy?: string
	order?: SortOrder
}

export function useSorting({
	defaultSortBy,
	defaultOrder = 'asc',
	syncToUrl = false,
}: UseSortingOptions = {}) {
	const [searchParams, setParams] = useUrlParams()
	const [localState, setLocalState] = useState<SortState>(() =>
		defaultSortBy
			? { sortBy: defaultSortBy, order: defaultOrder }
			: { sortBy: undefined, order: undefined },
	)

	// In URL mode a missing `?sort=` means the default/"off" state: show the
	// default column's arrow (the backend's default ordering) on first render.
	let sortBy: string | undefined
	let order: SortOrder | undefined
	if (syncToUrl) {
		const urlSort = searchParams.get('sort')
		if (urlSort) {
			sortBy = urlSort
			order = searchParams.get('order') === 'desc' ? 'desc' : 'asc'
		} else {
			sortBy = defaultSortBy
			order = defaultSortBy ? defaultOrder : undefined
		}
	} else {
		sortBy = localState.sortBy
		order = localState.order
	}

	const toggle = useCallback(
		(key: string) => {
			// Cycle the clicked column: new column → asc, then asc → desc → off.
			let next: SortState
			if (sortBy !== key) next = { sortBy: key, order: 'asc' }
			else if (order === 'asc') next = { sortBy: key, order: 'desc' }
			else next = { sortBy: undefined, order: undefined }

			if (syncToUrl) {
				setParams({
					sort: next.sortBy ?? null,
					order: next.sortBy ? next.order : null,
					// Sorting changes the result set order — go back to page one.
					page: null,
				})
			} else {
				setLocalState(next)
			}
		},
		[sortBy, order, syncToUrl, setParams],
	)

	return { sortBy, order, toggle }
}

/** The object returned by `useSorting`. */
export type Sorting = ReturnType<typeof useSorting>
