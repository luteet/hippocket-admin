import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { usePagination } from '@/hooks/usePagination'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useSharedPartners } from './hooks'

export function useSharedPartnersPage() {
	const navigate = useNavigate()
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search)
	const pagination = usePagination({
		count: 20,
		storageKey: 'shared-partners',
	})

	// Reset to the first page when the search changes.
	useEffect(() => {
		pagination.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch])

	const { data, isLoading, isFetching } = useSharedPartners({
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
		goToCreate: () => navigate('/shared-partners/new'),
		openSharedPartner: (id: string) => navigate(`/shared-partners/${id}`),
	}
}
