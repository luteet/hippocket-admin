import { useState } from 'react'

/**
 * Controlled row-selection state for a list page, scoped to the rows currently
 * on screen. Selection is meaningful only for the shown rows, so it is cleared
 * whenever `resetKey` changes — pass the current page's row array (or any value
 * that changes on page/search/filter/sort/refetch) so a context switch drops a
 * stale selection. The reset runs during render (React's "derive state from
 * props" pattern), mirroring DataTable's `orderedData` reset, so the cleared
 * selection is visible in the same commit the rows change.
 *
 * Returns the id array plus `setSelectedIds`/`clear`; feed `selectedIds` +
 * `onSelectionChange` straight into `ListPage`'s `selection` prop.
 */
export function useRowSelection<Id extends string | number = string | number>(
	resetKey: unknown,
) {
	const [selectedIds, setSelectedIds] = useState<Id[]>([])
	const [prevKey, setPrevKey] = useState(resetKey)

	if (resetKey !== prevKey) {
		setPrevKey(resetKey)
		// Guard on length so we don't queue an endless render loop with a fresh
		// `[]` reference when the selection is already empty.
		if (selectedIds.length) setSelectedIds([])
	}

	return {
		selectedIds,
		setSelectedIds,
		clear: () => setSelectedIds([]),
	}
}
