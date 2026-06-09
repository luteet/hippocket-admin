import { useNavigate } from 'react-router'

import { usePagination } from '@/hooks/usePagination'
import { usePropertyImages } from './hooks'

export function usePropertyImagesPage() {
	const navigate = useNavigate()
	const pagination = usePagination({
		count: 24,
		storageKey: 'property-images',
	})

	const { data, isLoading, isFetching } = usePropertyImages({
		offset: pagination.offset,
		count: pagination.count,
	})

	return {
		data,
		isLoading,
		isFetching,
		pagination,
		openImage: (id: string) => navigate(`/property-images/${id}`),
	}
}
