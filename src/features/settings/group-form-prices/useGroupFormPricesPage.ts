import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { usePagination } from '@/hooks/usePagination'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useGroupFormPrices } from '../hooks'

export function useGroupFormPricesPage() {
	const navigate = useNavigate()
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search)
	const pagination = usePagination({
		count: 20,
		storageKey: 'group-form-prices',
	})

	useEffect(() => {
		pagination.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch])

	const { data, isLoading, isFetching } = useGroupFormPrices({
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
		goToCreate: () => navigate('/group-form-prices/new'),
		openItem: (id: string) => navigate(`/group-form-prices/${id}/edit`),
	}
}
