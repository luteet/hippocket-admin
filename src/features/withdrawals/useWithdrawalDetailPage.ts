import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import { useWithdrawal, useDeleteWithdrawal } from './hooks'

export function useWithdrawalDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: withdrawal, isLoading } = useWithdrawal(id)
	const deleteMut = useDeleteWithdrawal()

	const handleDelete = async () => {
		if (!id) return
		try {
			await deleteMut.mutateAsync(id)
			toast.success('Withdrawal deleted')
			navigate('/withdrawals')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete'))
		}
	}

	return {
		withdrawal,
		isLoading,
		isDeleting: deleteMut.isPending,
		handleDelete,
		goBack: () => navigate('/withdrawals'),
		goToEdit: () => navigate(`/withdrawals/${id}/edit`),
	}
}
