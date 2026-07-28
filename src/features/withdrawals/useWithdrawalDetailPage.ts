import { useDetailPage, useDetailPageDelete } from '@/components/detail/useDetailPage'
import { useWithdrawal, useDeleteWithdrawal } from './hooks'

export function useWithdrawalDetailPage() {
	const { id, onBack, onEdit } =
		useDetailPage({ basePath: '/withdrawals' })
	const { data: withdrawal, isLoading } = useWithdrawal(id)
	const deleteMut = useDeleteWithdrawal()
	const { onDelete, isDeleting } = useDetailPageDelete(
		id,
		(id) => deleteMut.mutateAsync(id),
		deleteMut.isPending,
		{ basePath: '/withdrawals', successMessage: 'Withdrawal deleted' },
	)

	return {
		withdrawal,
		isLoading,
		ready: Boolean(withdrawal),
		onBack,
		onEdit,
		onDelete,
		isDeleting,
	}
}
