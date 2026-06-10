import { useMemo } from 'react'
import { useNavigate } from 'react-router'

import { usePagination } from '@/hooks/usePagination'
import { useSorting } from '@/hooks/useSorting'
import { useUrlParams } from '@/hooks/useUrlState'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useReferrals, useStatuses } from './hooks'

export const ALL = '__all__'

export function useReferralsPage() {
	const navigate = useNavigate()
	// Search, filters (status, paid), sort and page all live in the URL
	// (deep-linkable, survives reload). Each change resets the page in one write.
	const [params, setParams] = useUrlParams()
	const search = params.get('q') ?? ''
	const setSearch = (value: string) => setParams({ q: value, page: null })
	const debouncedSearch = useDebouncedValue(search)
	const statusLabel = params.get('status') ?? ALL
	const setStatusLabel = (value: string) =>
		setParams({ status: value === ALL ? null : value, page: null })
	const isPaid = params.get('paid') ?? ALL
	const setIsPaid = (value: string) =>
		setParams({ paid: value === ALL ? null : value, page: null })
	const pagination = usePagination({
		count: 20,
		storageKey: 'referrals',
		syncToUrl: true,
	})
	const sorting = useSorting({
		defaultSortBy: 'created_at',
		defaultOrder: 'desc',
		syncToUrl: true,
	})

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
	const clearFilters = () =>
		setParams({ status: null, paid: null, page: null })

	const { data, isLoading, isFetching } = useReferrals({
		offset: pagination.offset,
		count: pagination.count,
		search: debouncedSearch || undefined,
		status_label: statusLabel === ALL ? undefined : statusLabel,
		is_paid: isPaid === ALL ? undefined : isPaid === 'true',
		sort_by: sorting.sortBy,
		order: sorting.order,
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
		sorting,
		goToDetail: (id: string) => navigate(`/referrals/${id}`),
	}
}
