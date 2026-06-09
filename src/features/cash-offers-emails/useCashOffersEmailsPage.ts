import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { usePagination } from '@/hooks/usePagination'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useCashOffersEmails, useGroupOptions } from './hooks'

export const ALL = '__all__'

export const ACTIVE_OPTIONS = [
	{ value: ALL, label: 'All' },
	{ value: 'true', label: 'Active' },
	{ value: 'false', label: 'Inactive' },
]

export function useCashOffersEmailsPage() {
	const navigate = useNavigate()
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search)
	const [group, setGroup] = useState(ALL)
	const [isActive, setIsActive] = useState(ALL)
	const pagination = usePagination({
		count: 20,
		storageKey: 'cash-offers-emails',
	})

	const { data: groupOptions } = useGroupOptions()

	const activeFilterCount =
		(group !== ALL ? 1 : 0) + (isActive !== ALL ? 1 : 0)
	const clearFilters = () => {
		setGroup(ALL)
		setIsActive(ALL)
	}

	// Reset to the first page when any filter changes.
	useEffect(() => {
		pagination.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch, group, isActive])

	const { data, isLoading, isFetching } = useCashOffersEmails({
		offset: pagination.offset,
		count: pagination.count,
		search: debouncedSearch || undefined,
		group_id: group === ALL ? undefined : Number(group),
		is_active: isActive === ALL ? undefined : isActive === 'true',
	})

	return {
		search,
		setSearch,
		group,
		setGroup,
		isActive,
		setIsActive,
		groupOptions: groupOptions ?? [],
		activeFilterCount,
		clearFilters,
		data,
		isLoading,
		isFetching,
		pagination,
		goToCreate: () => navigate('/cash-offers-emails/new'),
		openEmail: (id: string) => navigate(`/cash-offers-emails/${id}`),
	}
}
