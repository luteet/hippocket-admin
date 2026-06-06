import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { usePagination } from '@/hooks/usePagination'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { WithdrawalMethod, WithdrawalStatus } from '@/types/api'
import { useWithdrawals } from './hooks'

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
	}, [debouncedSearch, status, method])

	const { data, isLoading, isFetching } = useWithdrawals({
		offset: pagination.offset,
		count: pagination.count,
		search: debouncedSearch || undefined,
		status: status === ALL ? undefined : (status as WithdrawalStatus),
		method: method === ALL ? undefined : (method as WithdrawalMethod),
	})

	return {
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
		openWithdrawal: (id: string) => navigate(`/withdrawals/${id}`),
		goToCreate: () => navigate('/withdrawals/new'),
	}
}
