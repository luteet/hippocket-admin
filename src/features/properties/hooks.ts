import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
	CreatePropertyDto,
	PaginationParams,
	Property,
	UpdatePropertyDto,
} from '@/types/api'
import {
	createProperty,
	deleteProperty,
	getProperty,
	listProperties,
	reorderPropertyImages,
	updateProperty,
	uploadPropertyImage,
} from './api'

const KEY = 'properties'

export function useProperties(params: PaginationParams) {
	return useQuery({
		queryKey: [KEY, params],
		queryFn: () => listProperties(params),
	})
}

export function useProperty(id: string | undefined) {
	return useQuery({
		queryKey: [KEY, 'detail', id],
		queryFn: () => getProperty(id as string),
		enabled: !!id,
	})
}

export function useCreateProperty() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: CreatePropertyDto) => createProperty(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useUpdateProperty() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdatePropertyDto }) =>
			updateProperty(id, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useDeleteProperty() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deleteProperty(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

/**
 * Upload a property's main photo. Like the agent-avatar upload, this does NOT
 * invalidate the properties query: the edit form re-syncs (`reset`) whenever its
 * cached property changes, so refetching here would wipe in-progress form edits.
 * The uploader updates its own preview from the returned property instead.
 */
export function useUploadPropertyImage() {
	return useMutation({
		mutationFn: ({ id, file }: { id: string; file: File }) =>
			uploadPropertyImage(id, file),
	})
}

/**
 * Persist a drag-and-drop reorder of a property's gallery (renumbers each
 * image's `sort` to `1..N` and returns the reordered images). Optimistically
 * reorders the `images` on the cached property detail and reassigns `sort` to
 * match, then writes the server's authoritative result straight into the cache
 * on success. We deliberately do NOT invalidate the property detail: a refetch
 * would briefly drop the gallery into its loading state right after the drop. A
 * failed request rolls back.
 */
export function useReorderPropertyImages(propertyId: string) {
	const qc = useQueryClient()
	const detailKey = [KEY, 'detail', propertyId]
	return useMutation({
		mutationFn: (ids: string[]) => reorderPropertyImages(propertyId, ids),
		onMutate: async (ids: string[]) => {
			const previous = qc.getQueryData<Property>(detailKey)
			// Apply the optimistic order synchronously (before any await) so the
			// tiles settle into place in the same frame the drag ends —
			// otherwise the dropped tile briefly snaps back to its origin.
			if (previous?.images) {
				const rank = new Map(ids.map((id, i) => [id, i]))
				const images = [...previous.images]
					.sort(
						(a, b) =>
							(rank.get(a.id) ?? Infinity) -
							(rank.get(b.id) ?? Infinity),
					)
					.map((image, i) => ({ ...image, sort: i + 1 }))
				qc.setQueryData(detailKey, { ...previous, images })
			}
			// Then stop any in-flight GET from clobbering the optimistic data.
			await qc.cancelQueries({ queryKey: detailKey })
			return { previous }
		},
		onError: (_err, _ids, ctx) => {
			if (ctx?.previous) qc.setQueryData(detailKey, ctx.previous)
		},
		onSuccess: (images) => {
			// Reconcile the property detail with the server's order without a
			// refetch (which would flash the gallery's loading state).
			const current = qc.getQueryData<Property>(detailKey)
			if (current) qc.setQueryData(detailKey, { ...current, images })
			// The off-screen standalone property-images list mirrors these;
			// refresh it in the background.
			qc.invalidateQueries({ queryKey: ['property-images'] })
		},
	})
}
