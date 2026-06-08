import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import { useContact, useDeleteContact } from './hooks'

export function useContactDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: contact, isLoading } = useContact(id)
	const deleteMut = useDeleteContact()

	const handleDelete = async () => {
		if (!id) return
		try {
			await deleteMut.mutateAsync(id)
			toast.success('Contact deleted')
			navigate('/contacts')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete'))
		}
	}

	return {
		contact,
		isLoading,
		isDeleting: deleteMut.isPending,
		handleDelete,
		goBack: () => navigate('/contacts'),
		goToEdit: () => navigate(`/contacts/${id}/edit`),
	}
}
