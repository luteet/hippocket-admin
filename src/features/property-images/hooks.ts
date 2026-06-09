import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'

import type { UpdatePropertyImageDto } from '@/types/api'
import {
	deletePropertyImage,
	getPropertyImage,
	listPropertyImages,
	searchProperties,
	updatePropertyImage,
	type PropertyImageFilters,
} from './api'

const KEY = 'property-images'

export function usePropertyImages(filters: PropertyImageFilters) {
	return useQuery({
		queryKey: [KEY, filters],
		queryFn: () => listPropertyImages(filters),
	})
}

export function usePropertyImage(id: string | undefined) {
	return useQuery({
		queryKey: [KEY, 'detail', id],
		queryFn: () => getPropertyImage(id as string),
		enabled: !!id,
	})
}

export function useUpdatePropertyImage() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({
			id,
			dto,
		}: {
			id: string
			dto: UpdatePropertyImageDto
		}) => updatePropertyImage(id, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useDeletePropertyImage() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deletePropertyImage(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

/**
 * Paginated property search for the relink picker. Each page is one
 * `/properties/` request; the Combobox loads the next page as the user scrolls.
 */
export function usePropertySearch(search: string) {
	return useInfiniteQuery({
		queryKey: ['properties', 'search', search],
		queryFn: ({ pageParam }) => searchProperties(search, pageParam),
		initialPageParam: 0,
		getNextPageParam: (last) => {
			const next = last.offset + last.items.length
			return last.items.length > 0 && next < last.total ? next : undefined
		},
		staleTime: 5 * 60_000,
		placeholderData: (prev) => prev,
	})
}
