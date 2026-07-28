import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { usePagination } from '@/hooks/usePagination'
import { useSorting } from '@/hooks/useSorting'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useTransactions } from './hooks'

// Sentinel for the "no filter" option in selects (empty string can't be a SelectItem).
export const ALL = '__all__'

export function usePartnerConnectPage() {
	const navigate = useNavigate()
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search)
	const [status, setStatus] = useState(ALL)
	const [role, setRole] = useState(ALL)
	const [createdFrom, setCreatedFrom] = useState('')
	const [createdTo, setCreatedTo] = useState('')
	const pagination = usePagination({
		count: 20,
		storageKey: 'partner-connect',
	})
	const sorting = useSorting({
		defaultSortBy: 'created_at',
		defaultOrder: 'desc',
	})

	// How many popover filters are set — shown as a badge on the Filters button.
	const activeFilterCount =
		(status !== ALL ? 1 : 0) +
		(role !== ALL ? 1 : 0) +
		(createdFrom ? 1 : 0) +
		(createdTo ? 1 : 0)

	const clearFilters = () => {
		setStatus(ALL)
		setRole(ALL)
		setCreatedFrom('')
		setCreatedTo('')
	}

	useEffect(() => {
		pagination.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		debouncedSearch,
		status,
		role,
		createdFrom,
		createdTo,
		sorting.sortBy,
		sorting.order,
	])

	const { data, isLoading, isFetching, refetch } = useTransactions({
		offset: pagination.offset,
		count: pagination.count,
		search: debouncedSearch || undefined,
		status: status === ALL ? undefined : (status as 'active' | 'closed'),
		role: role === ALL ? undefined : (role as 'Buyer' | 'Seller'),
		created_from: createdFrom || undefined,
		created_to: createdTo || undefined,
		sort_by: sorting.sortBy,
		order: sorting.order as 'asc' | 'desc' | undefined,
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
		onRowClick: (row: unknown) => navigate(`/partner-connect/${(row as { id: string }).id}`),

		// --- page-specific content ---
		status,
		setStatus,
		role,
		setRole,
		createdFrom,
		setCreatedFrom,
		createdTo,
		setCreatedTo,
		activeFilterCount,
		clearFilters,
		goToCreate: () => navigate('/partner-connect/new'),
	}
}
