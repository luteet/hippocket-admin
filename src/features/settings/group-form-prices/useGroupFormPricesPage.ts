import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { usePagination } from '@/hooks/usePagination'
import { useSorting } from '@/hooks/useSorting'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useGroupFormPrices } from '../hooks'

export function useGroupFormPricesPage() {
	const navigate = useNavigate()
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search)
	const pagination = usePagination({
		count: 20,
		storageKey: 'group-form-prices',
	})
	const sorting = useSorting({
		defaultSortBy: 'form_config_name',
		defaultOrder: 'asc',
	})

	useEffect(() => {
		pagination.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch, sorting.sortBy, sorting.order])

	const { data, isLoading, isFetching, refetch } = useGroupFormPrices({
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
			navigate(`/group-form-prices/${(row as { id: string }).id}/edit`),

		// --- page-specific content ---
		goToCreate: () => navigate('/group-form-prices/new'),
	}
}
