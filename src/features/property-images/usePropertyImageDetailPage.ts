import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import { usePropertyImage, useDeletePropertyImage } from './hooks'

export function usePropertyImageDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: image, isLoading } = usePropertyImage(id)
	const deleteMut = useDeletePropertyImage()

	const handleDelete = async () => {
		if (!id) return
		try {
			await deleteMut.mutateAsync(id)
			toast.success('Image deleted')
			navigate('/property-images')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete'))
		}
	}

	return {
		image,
		isLoading,
		isDeleting: deleteMut.isPending,
		handleDelete,
		goBack: () => navigate('/property-images'),
		goToEdit: () => navigate(`/property-images/${id}/edit`),
	}
}
