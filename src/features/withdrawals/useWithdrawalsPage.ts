import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { usePagination } from '@/hooks/usePagination'
import { useSorting } from '@/hooks/useSorting'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useRowSelection } from '@/hooks/useRowSelection'
import { useBulkAction } from '@/hooks/useBulkAction'
import type {
	Withdrawal,
	WithdrawalMethod,
	WithdrawalStatus,
} from '@/types/api'
import { useWithdrawals } from './hooks'
import { updateWithdrawal } from './api'

export const ALL = '__all__'

export const STATUS_OPTIONS: { value: WithdrawalStatus; label: string }[] = [
	{ value: 'waiting', label: 'Waiting' },
	{ value: 'success', label: 'Success' },
	{ value: 'cancel', label: 'Cancel' },
]

export const METHOD_OPTIONS: { value: WithdrawalMethod; label: string }[] = [
	{ value: 'paypal', label: 'PayPal' },
	{ value: 'venmo', label: 'Venmo' },
	{ value: 'cash_app', label: 'Cash App' },
	{ value: 'zelle', label: 'Zelle' },
]

export function useWithdrawalsPage() {
	const navigate = useNavigate()
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search)
	const [status, setStatus] = useState(ALL)
	const [method, setMethod] = useState(ALL)
	const pagination = usePagination({ count: 20, storageKey: 'withdrawals' })
	const sorting = useSorting({
		defaultSortBy: 'created_at',
		defaultOrder: 'desc',
	})

	// How many popover filters are set — shown as a badge on the Filters button.
	const activeFilterCount =
		(status !== ALL ? 1 : 0) + (method !== ALL ? 1 : 0)
	const clearFilters = () => {
		setStatus(ALL)
		setMethod(ALL)
	}

	// Reset to the first page when any filter changes.
	useEffect(() => {
		pagination.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch, status, method, sorting.sortBy, sorting.order])

	const { data, isLoading, isFetching } = useWithdrawals({
		offset: pagination.offset,
		count: pagination.count,
		search: debouncedSearch || undefined,
		status: status === ALL ? undefined : (status as WithdrawalStatus),
		method: method === ALL ? undefined : (method as WithdrawalMethod),
		sort_by: sorting.sortBy,
		order: sorting.order,
	})

	// --- Bulk actions (approve / reject the selected requests) --------------
	const qc = useQueryClient()
	const { selectedIds, setSelectedIds, clear } = useRowSelection(data?.items)
	const { run, isRunning: isBulkRunning } = useBulkAction<Withdrawal>()

	const selectedItems = useMemo(
		() => data?.items.filter((w) => selectedIds.includes(w.id)) ?? [],
		[data, selectedIds],
	)

	// Approve/reject reuse the full-update endpoint (status only changes; amount
	// and method are sent unchanged). On done, refetch and keep any failed rows
	// selected so the user can retry just those.
	const bulkSetStatus = (newStatus: WithdrawalStatus, verb: string) =>
		run(
			selectedItems,
			(w) =>
				updateWithdrawal(w.id, {
					amount: w.amount,
					method: w.method,
					status: newStatus,
				}),
			{
				verb,
				onDone: (failed) => {
					qc.invalidateQueries({ queryKey: ['withdrawals'] })
					setSelectedIds(failed.map((w) => w.id))
				},
			},
		)

	return {
		selectedIds,
		setSelectedIds,
		clearSelection: clear,
		selectedCount: selectedItems.length,
		isBulkRunning,
		bulkApprove: () => bulkSetStatus('success', 'Approved'),
		bulkReject: () => bulkSetStatus('cancel', 'Rejected'),
		search,
		setSearch,
		status,
		setStatus,
		method,
		setMethod,
		activeFilterCount,
		clearFilters,
		data,
		isLoading,
		isFetching,
		pagination,
		sorting,
		openWithdrawal: (id: string) => navigate(`/withdrawals/${id}`),
		goToCreate: () => navigate('/withdrawals/new'),
	}
}
