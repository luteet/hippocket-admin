import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'

import { usePagination } from '@/hooks/usePagination'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useReferrals, useStatuses } from './hooks'

export const ALL = '__all__'

export function useReferralsPage() {
	const navigate = useNavigate()
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search)
	const [statusLabel, setStatusLabel] = useState(ALL)
	const [isPaid, setIsPaid] = useState(ALL)
	const pagination = usePagination({ count: 20, storageKey: 'referrals' })

	const { data: statuses } = useStatuses()

	const statusNameByLabel = useMemo(() => {
		const map: Record<string, string> = {}
		statuses?.items.forEach((s) => {
			map[s.label] = s.name
		})
		return map
	}, [statuses])

	// How many popover filters are set — shown as a badge on the Filters button.
	const activeFilterCount =
		(statusLabel !== ALL ? 1 : 0) + (isPaid !== ALL ? 1 : 0)
	const clearFilters = () => {
		setStatusLabel(ALL)
		setIsPaid(ALL)
	}

	useEffect(() => {
		pagination.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch, statusLabel, isPaid])

	const { data, isLoading, isFetching } = useReferrals({
		offset: pagination.offset,
		count: pagination.count,
		search: debouncedSearch || undefined,
		status_label: statusLabel === ALL ? undefined : statusLabel,
		is_paid: isPaid === ALL ? undefined : isPaid === 'true',
	})

	return {
		search,
		setSearch,
		statusLabel,
		setStatusLabel,
		isPaid,
		setIsPaid,
		activeFilterCount,
		clearFilters,
		statuses,
		statusNameByLabel,
		data,
		isLoading,
		isFetching,
		pagination,
		goToDetail: (id: string) => navigate(`/referrals/${id}`),
	}
}
