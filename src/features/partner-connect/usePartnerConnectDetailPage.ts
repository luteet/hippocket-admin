import { useDetailPage, useDetailPageDelete } from '@/components/detail/useDetailPage'
import { useTransaction, useDeleteTransaction } from './hooks'

export function usePartnerConnectDetailPage() {
	const { id, onBack, onEdit, activeTab, onTabChange } =
		useDetailPage({ basePath: '/partner-connect', tabKeys: ['details', 'timeline'] as const })
	const { data: transaction, isLoading } = useTransaction(id)
	const deleteMut = useDeleteTransaction()
	const { onDelete, isDeleting } = useDetailPageDelete(
		id,
		(id) => deleteMut.mutateAsync(id),
		deleteMut.isPending,
		{ basePath: '/partner-connect', successMessage: 'Partner Connect deleted' },
	)

	return {
		transaction,
		transactionId: id,
		isLoading,
		ready: Boolean(transaction),
		onBack,
		onEdit,
		activeTab,
		onTabChange,
		onDelete,
		isDeleting,
	}
}
