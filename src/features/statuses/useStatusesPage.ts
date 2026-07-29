import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { usePagination } from '@/hooks/usePagination'
import { useSorting } from '@/hooks/useSorting'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { Status } from '@/types/api'
import { useReorderStatuses, useStatuses } from './hooks'

export function useStatusesPage() {
	const navigate = useNavigate()
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search)
	const pagination = usePagination({ count: 20, storageKey: 'statuses' })
	const sorting = useSorting({
		defaultSortBy: 'priority',
		defaultOrder: 'asc',
	})

	// Reset to the first page when the search or sort changes.
	useEffect(() => {
		pagination.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch, sorting.sortBy, sorting.order])

	const { data, isLoading, isFetching, refetch } = useStatuses({
		offset: pagination.offset,
		count: pagination.count,
		search: debouncedSearch || undefined,
		sort_by: sorting.sortBy,
		order: sorting.order,
	})

	const reorderMut = useReorderStatuses()

	return {
		// --- ListPageContext fields ---
		search,
		onSearchChange: setSearch,
		onRefresh: () => void refetch(),
		pagination,
		data,
		isLoading,
		isFetching,
		sorting: {
			sortBy: sorting.sortBy,
			order: sorting.order,
			onToggle: sorting.toggle,
		},
		onRowClick: (row: unknown) =>
			navigate(`/statuses/${(row as { id: number }).id}`),

		// --- page-specific content ---
		// Drag-and-drop only makes sense in the natural `priority` order with no
		// search, and only when the whole set is on one page — a partial reorder
		// would renumber just the visible rows and push the rest behind them.
		reorder: {
			getRowId: (row: Status) => row.id,
			onReorder: (ids: (string | number)[]) =>
				reorderMut.mutate(ids as number[]),
			enabled:
				!debouncedSearch.trim() &&
				sorting.sortBy === 'priority' &&
				sorting.order === 'asc' &&
				pagination.pageCount(data?.total ?? 0) <= 1,
		},
		goToCreate: () => navigate('/statuses/new'),
	}
}
