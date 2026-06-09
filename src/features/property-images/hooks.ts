import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'

import type { UpdatePropertyImageDto } from '@/types/api'
import {
	addPropertyImage,
	deletePropertyImage,
	getPropertyImage,
	listPropertyImages,
	replacePropertyImageFile,
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
 * Add a gallery photo to a property. Invalidates both the property-images list
 * and the `properties` query so the property detail page's inline `images`
 * gallery picks up the new photo.
 */
export function useAddPropertyImage() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({
			propertyId,
			file,
		}: {
			propertyId: string
			file: File
		}) => addPropertyImage(propertyId, file),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [KEY] })
			qc.invalidateQueries({ queryKey: ['properties'] })
		},
	})
}

/** Replace an existing gallery photo's file. Invalidates the property-images
 *  query so the detail header and list thumbnails refresh from the new versions. */
export function useReplacePropertyImageFile() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, file }: { id: string; file: File }) =>
			replacePropertyImageFile(id, file),
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
