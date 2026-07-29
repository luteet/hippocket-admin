import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { usePagination } from '@/hooks/usePagination'
import { useSorting } from '@/hooks/useSorting'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useChats } from './hooks'

export function useChatsPage() {
	const navigate = useNavigate()
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search)
	const pagination = usePagination({ count: 20, storageKey: 'chats' })
	const sorting = useSorting({
		defaultSortBy: 'created_at',
		defaultOrder: 'desc',
	})

	// Reset to the first page when the search or sort changes.
	useEffect(() => {
		pagination.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch, sorting.sortBy, sorting.order])

	const { data, isLoading, isFetching, refetch } = useChats({
		offset: pagination.offset,
		count: pagination.count,
		search: debouncedSearch || undefined,
		sort_by: sorting.sortBy,
		order: sorting.order,
	})

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
			navigate(`/chats/${(row as { id: string }).id}`),

		// --- page-specific content ---
		goToCreate: () => navigate('/chats/new'),
	}
}
