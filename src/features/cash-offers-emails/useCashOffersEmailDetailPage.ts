import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import { useCashOffersEmail, useDeleteCashOffersEmail } from './hooks'

export function useCashOffersEmailDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: email, isLoading } = useCashOffersEmail(id)
	const deleteMut = useDeleteCashOffersEmail()

	const handleDelete = async () => {
		if (!id) return
		try {
			await deleteMut.mutateAsync(id)
			toast.success('Email deleted')
			navigate('/cash-offers-emails')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete'))
		}
	}

	return {
		email,
		isLoading,
		isDeleting: deleteMut.isPending,
		handleDelete,
		goBack: () => navigate('/cash-offers-emails'),
		goToEdit: () => navigate(`/cash-offers-emails/${id}/edit`),
	}
}
