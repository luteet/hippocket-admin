import { useDetailPage, useDetailPageDelete } from '@/components/detail/useDetailPage'
import { useCashOffersEmail, useDeleteCashOffersEmail } from './hooks'

export function useCashOffersEmailDetailPage() {
	const { id, onBack, onEdit } =
		useDetailPage({ basePath: '/cash-offers-emails' })
	const { data: email, isLoading } = useCashOffersEmail(id)
	const deleteMut = useDeleteCashOffersEmail()
	const { onDelete, isDeleting } = useDetailPageDelete(
		id,
		(id) => deleteMut.mutateAsync(id),
		deleteMut.isPending,
		{ basePath: '/cash-offers-emails', successMessage: 'Email deleted' },
	)

	return {
		email,
		isLoading,
		ready: Boolean(email),
		onBack,
		onEdit,
		onDelete,
		isDeleting,
	}
}
