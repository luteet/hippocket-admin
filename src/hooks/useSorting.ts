import { useState, useCallback } from 'react'
import type { SortOrder } from '@/types/api'

interface UseSortingOptions {
	/**
	 * The column the list is sorted by initially — should match the endpoint's
	 * server-side default (see admin_sorting.md). Shown with its arrow on first
	 * render so the user sees what drives the order.
	 */
	defaultSortBy?: string
	/** Initial direction for {@link defaultSortBy}. Defaults to `'asc'`. */
	defaultOrder?: SortOrder
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
}: UseSortingOptions = {}) {
	const [state, setState] = useState<SortState>(() =>
		defaultSortBy
			? { sortBy: defaultSortBy, order: defaultOrder }
			: { sortBy: undefined, order: undefined },
	)

	const toggle = useCallback((key: string) => {
		setState((prev) => {
			if (prev.sortBy !== key) return { sortBy: key, order: 'asc' }
			// Same column: asc → desc → off.
			if (prev.order === 'asc') return { sortBy: key, order: 'desc' }
			return { sortBy: undefined, order: undefined }
		})
	}, [])

	return { sortBy: state.sortBy, order: state.order, toggle }
}

/** The object returned by `useSorting`. */
export type Sorting = ReturnType<typeof useSorting>
