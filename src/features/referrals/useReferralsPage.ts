import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { usePagination } from '@/hooks/usePagination'
import { useSorting } from '@/hooks/useSorting'
import { useUrlParams, useUrlSearch } from '@/hooks/useUrlState'
import type { ActiveFilter } from '@/components/list/FilterChips'
import { useRowSelection } from '@/hooks/useRowSelection'
import { useBulkAction } from '@/hooks/useBulkAction'
import type { ReferralListItem } from '@/types/api'
import { useReferrals, useStatuses, useGroupOptions } from './hooks'
import { deleteReferral, markReferralPaid } from './api'

export const ALL = '__all__'

export function useReferralsPage() {
	const navigate = useNavigate()
	// Search, filters (status, paid), sort and page all live in the URL
	// (deep-linkable, survives reload). Each change resets the page in one write.
	const [params, setParams] = useUrlParams()
	// Instant local input, debounced URL write; `committedSearch` (the URL value)
	// drives the query. See useUrlSearch.
	const [search, setSearch, committedSearch] = useUrlSearch('q')
	const statusLabel = params.get('status') ?? ALL
	const setStatusLabel = (value: string) =>
		setParams({ status: value === ALL ? null : value, page: null })
	const isPaid = params.get('paid') ?? ALL
	const setIsPaid = (value: string) =>
		setParams({ paid: value === ALL ? null : value, page: null })

	// Group filter — kept in local state so the GroupMultiSelect dropdown
	// stays open while toggling checkboxes (no URL re-render on each change).
	const [groupIds, setGroupIds] = useState<number[]>([])
	const toggleGroupId = useCallback(
		(id: number) =>
			setGroupIds((prev) =>
				prev.includes(id)
					? prev.filter((g) => g !== id)
					: [...prev, id],
			),
		[],
	)

	const { data: groupOptions } = useGroupOptions()

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

	// Group name lookup for the filter chip.
	const groupNameById = useMemo(() => {
		const map: Record<number, string> = {}
		groupOptions?.forEach((g) => {
			map[g.id] = g.name
		})
		return map
	}, [groupOptions])

	// Active filters as chips (Status / Payment / Groups), resolved to human
	// labels. A stale value with no matching option still renders (raw value) so
	// the user can clear it. The badge count is derived.
	const activeFilters: ActiveFilter[] = [
		statusLabel !== ALL && {
			key: 'status',
			label: 'Status',
			value: statusNameByLabel[statusLabel] ?? statusLabel,
		},
		isPaid !== ALL && {
			key: 'paid',
			label: 'Payment',
			value: isPaid === 'true' ? 'Paid' : 'Unpaid',
		},
		groupIds.length > 0 && {
			key: 'group_ids',
			label: 'Group',
			value: groupIds
				.map((id) => groupNameById[id] ?? `#${id}`)
				.join(', '),
		},
	].filter(Boolean) as ActiveFilter[]

	const activeFilterCount = activeFilters.length
	const removeFilter = (key: string) => {
		if (key === 'group_ids') setGroupIds([])
		else setParams({ [key]: null, page: null })
	}
	const clearFilters = () => {
		setGroupIds([])
		setParams({ status: null, paid: null, page: null })
	}
	// Whether the empty list is "filtered to nothing" (search or any filter
	// active) vs genuinely having no records — the page picks its empty state
	// from this. `clearAll` resets search and every filter in one write.
	const hasFilters = activeFilterCount > 0 || Boolean(committedSearch)
	const clearAll = () => {
		setGroupIds([])
		setParams({
			q: null,
			status: null,
			paid: null,
			page: null,
		})
	}

	const { data, isLoading, isFetching, refetch } = useReferrals({
		offset: pagination.offset,
		count: pagination.count,
		search: committedSearch || undefined,
		status_label: statusLabel === ALL ? undefined : statusLabel,
		is_paid: isPaid === ALL ? undefined : isPaid === 'true',
		group_ids: groupIds.length ? groupIds : undefined,
		sort_by: sorting.sortBy,
		order: sorting.order,
	})

	// --- Bulk actions (mark-paid / delete the selected referrals) -----------
	const qc = useQueryClient()
	const {
		selectedIds,
		setSelectedIds,
		clear: clearSelection,
	} = useRowSelection(data?.items)
	const { run, isRunning: isBulkRunning } = useBulkAction<ReferralListItem>()

	const selectedItems = useMemo(
		() => data?.items.filter((r) => selectedIds.includes(r.id)) ?? [],
		[data, selectedIds],
	)

	const finishBulk = (failed: ReferralListItem[]) => {
		qc.invalidateQueries({ queryKey: ['referrals'] })
		setSelectedIds(failed.map((r) => r.id))
	}

	const bulkMarkPaid = () =>
		run(selectedItems, (r) => markReferralPaid(r.id), {
			verb: 'Marked paid',
			onDone: finishBulk,
		})

	const bulkDelete = () =>
		run(selectedItems, (r) => deleteReferral(r.id), {
			verb: 'Deleted',
			onDone: finishBulk,
		})

	return {
		selectedIds,
		setSelectedIds,
		clearSelection,
		selectedCount: selectedItems.length,
		isBulkRunning,
		bulkMarkPaid,
		bulkDelete,
		search,
		setSearch,
		statusLabel,
		setStatusLabel,
		isPaid,
		setIsPaid,
		groupIds,
		toggleGroupId,
		groupOptions,
		activeFilterCount,
		activeFilters,
		removeFilter,
		clearFilters,
		hasFilters,
		clearAll,
		statuses,
		statusNameByLabel,
		data,
		isLoading,
		isFetching,
		onRefresh: () => void refetch(),
		pagination,
		sorting,
		goToDetail: (id: string) => navigate(`/referrals/${id}`),
		totalPipelinePotential: data?.total_pipeline_potential,
	}
}
