import { useState, useEffect } from 'react'

import { usePagination } from '@/hooks/usePagination'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useReferrals, useStatuses } from './hooks'

export const ALL = '__all__'

export function useReferralsPage() {
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search)
	const [statusLabel, setStatusLabel] = useState(ALL)
	const [isPaid, setIsPaid] = useState(ALL)
	const pagination = usePagination({ count: 20 })
	const [openId, setOpenId] = useState<string | null>(null)

	const { data: statuses } = useStatuses()

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
		statuses,
		data,
		isLoading,
		isFetching,
		pagination,
		openId,
		setOpenId,
	}
}
