import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { usePagination } from '@/hooks/usePagination'
import { useSorting } from '@/hooks/useSorting'
import { usePropertyImages } from './hooks'

export function usePropertyImagesPage() {
	const navigate = useNavigate()
	const pagination = usePagination({
		count: 24,
		storageKey: 'property-images',
	})
	const sorting = useSorting({ defaultSortBy: 'sort', defaultOrder: 'asc' })

	useEffect(() => {
		pagination.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sorting.sortBy, sorting.order])

	const { data, isLoading, isFetching } = usePropertyImages({
		offset: pagination.offset,
		count: pagination.count,
		sort_by: sorting.sortBy,
		order: sorting.order,
	})

	return {
		data,
		isLoading,
		isFetching,
		pagination,
		sorting,
		openImage: (id: string) => navigate(`/property-images/${id}`),
	}
}
