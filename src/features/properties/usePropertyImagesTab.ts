import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { PropertyImage } from '@/types/api'
import {
	usePropertyImages,
	useUpdatePropertyImage,
	useDeletePropertyImage,
} from './hooks'

export function usePropertyImagesTab(propertyId: string) {
	const { data, isLoading } = usePropertyImages(propertyId)
	const updateMut = useUpdatePropertyImage(propertyId)
	const deleteMut = useDeletePropertyImage(propertyId)

	const [pendingDelete, setPendingDelete] = useState<PropertyImage | null>(
		null,
	)

	// Always render in gallery order.
	const images = useMemo(
		() => [...(data ?? [])].sort((a, b) => a.sort - b.sort),
		[data],
	)

	/** Swap an image with its neighbour in the given direction, persisting both
	 *  new `sort` values. */
	const handleMove = async (image: PropertyImage, direction: -1 | 1) => {
		const index = images.findIndex((i) => i.id === image.id)
		const neighbor = images[index + direction]
		if (!neighbor) return
		try {
			await Promise.all([
				updateMut.mutateAsync({
					imageId: image.id,
					dto: { sort: neighbor.sort },
				}),
				updateMut.mutateAsync({
					imageId: neighbor.id,
					dto: { sort: image.sort },
				}),
			])
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to reorder'))
		}
	}

	const handleDelete = async () => {
		if (!pendingDelete) return
		try {
			await deleteMut.mutateAsync(pendingDelete.id)
			toast.success('Image deleted')
			setPendingDelete(null)
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete image'))
		}
	}

	return {
		images,
		isLoading,
		isReordering: updateMut.isPending,
		handleMove,
		pendingDelete,
		setPendingDelete,
		isDeleting: deleteMut.isPending,
		handleDelete,
	}
}
