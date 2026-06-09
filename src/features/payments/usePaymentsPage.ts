import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { usePagination } from '@/hooks/usePagination'
import { useSorting } from '@/hooks/useSorting'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { usePayments, usePaymentsMeta } from './hooks'

// Sentinel for the "no filter" option in the type / form selects (an empty
// string can't be a SelectItem value in shadcn's Select).
export const ALL = '__all__'

export function usePaymentsPage() {
	const navigate = useNavigate()
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search)
	const [paymentType, setPaymentType] = useState(ALL)
	const [formName, setFormName] = useState(ALL)
	const [createdFrom, setCreatedFrom] = useState('')
	const [createdTo, setCreatedTo] = useState('')
	const pagination = usePagination({ count: 20, storageKey: 'payments' })
	const sorting = useSorting({
		defaultSortBy: 'created_at',
		defaultOrder: 'desc',
	})

	const { data: meta } = usePaymentsMeta()

	// How many popover filters are set — shown as a badge on the Filters button.
	const activeFilterCount =
		(paymentType !== ALL ? 1 : 0) +
		(formName !== ALL ? 1 : 0) +
		(createdFrom ? 1 : 0) +
		(createdTo ? 1 : 0)

	const clearFilters = () => {
		setPaymentType(ALL)
		setFormName(ALL)
		setCreatedFrom('')
		setCreatedTo('')
	}

	useEffect(() => {
		pagination.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		debouncedSearch,
		paymentType,
		formName,
		createdFrom,
		createdTo,
		sorting.sortBy,
		sorting.order,
	])

	const { data, isLoading, isFetching } = usePayments({
		offset: pagination.offset,
		count: pagination.count,
		search: debouncedSearch || undefined,
		payment_type: paymentType === ALL ? undefined : paymentType,
		form_name: formName === ALL ? undefined : formName,
		created_from: createdFrom || undefined,
		created_to: createdTo || undefined,
		sort_by: sorting.sortBy,
		order: sorting.order,
	})

	return {
		search,
		setSearch,
		paymentType,
		setPaymentType,
		formName,
		setFormName,
		createdFrom,
		setCreatedFrom,
		createdTo,
		setCreatedTo,
		activeFilterCount,
		clearFilters,
		paymentTypes: meta?.payment_types ?? [],
		formNames: meta?.form_names ?? [],
		data,
		isLoading,
		isFetching,
		pagination,
		sorting,
		goToDetail: (id: string) => navigate(`/payments/${id}`),
	}
}
