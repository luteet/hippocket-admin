import { useDetailPage, useDetailPageDelete } from '@/components/detail/useDetailPage'
import { usePropertyImage, useDeletePropertyImage } from './hooks'

export function usePropertyImageDetailPage() {
	const { id, onBack, onEdit } =
		useDetailPage({ basePath: '/property-images' })
	const { data: image, isLoading } = usePropertyImage(id)
	const deleteMut = useDeletePropertyImage()
	const { onDelete, isDeleting } = useDetailPageDelete(
		id,
		(id) => deleteMut.mutateAsync(id),
		deleteMut.isPending,
		{ basePath: '/property-images', successMessage: 'Image deleted' },
	)

	return {
		image,
		isLoading,
		ready: Boolean(image),
		onBack,
		onEdit,
		onDelete,
		isDeleting,
	}
}
