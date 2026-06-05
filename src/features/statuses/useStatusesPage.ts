import { useEffect, useState } from 'react'

import { usePagination } from '@/hooks/usePagination'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useStatuses } from './hooks'

export function useStatusesPage() {
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search)
	const pagination = usePagination({ count: 20, storageKey: 'statuses' })

	// Reset to the first page when the search changes.
	useEffect(() => {
		pagination.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch])

	const { data, isLoading, isFetching } = useStatuses({
		offset: pagination.offset,
		count: pagination.count,
		search: debouncedSearch || undefined,
	})

	return {
		search,
		setSearch,
		data,
		isLoading,
		isFetching,
		pagination,
	}
}
