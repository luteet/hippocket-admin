import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import { useSavedFilter, useDeleteSavedFilter } from './hooks'

export function useSavedFilterDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: filter, isLoading } = useSavedFilter(id)
	const deleteMut = useDeleteSavedFilter()

	const handleDelete = async () => {
		if (!id) return
		try {
			await deleteMut.mutateAsync(id)
			toast.success('Saved filter deleted')
			navigate('/saved-filters')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete'))
		}
	}

	return {
		filter,
		isLoading,
		isDeleting: deleteMut.isPending,
		handleDelete,
		goBack: () => navigate('/saved-filters'),
		goToEdit: () => navigate(`/saved-filters/${id}/edit`),
	}
}
