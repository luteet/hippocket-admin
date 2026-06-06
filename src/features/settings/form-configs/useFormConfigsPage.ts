import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { usePagination } from '@/hooks/usePagination'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useFormConfigs } from '../hooks'

export function useFormConfigsPage() {
	const navigate = useNavigate()
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search)
	const pagination = usePagination({ count: 20, storageKey: 'form-configs' })

	useEffect(() => {
		pagination.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch])

	const { data, isLoading, isFetching } = useFormConfigs({
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
		goToCreate: () => navigate('/form-configs/new'),
		openItem: (id: string) => navigate(`/form-configs/${id}/edit`),
	}
}
