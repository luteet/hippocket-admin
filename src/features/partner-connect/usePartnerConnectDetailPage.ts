import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import { useTransaction, useDeleteTransaction } from './hooks'

export type PartnerConnectDetailTab = 'details' | 'timeline'

export function usePartnerConnectDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: transaction, isLoading } = useTransaction(id)
	const deleteMut = useDeleteTransaction()
	const [tab, setTab] = useState<PartnerConnectDetailTab>('details')

	const handleDelete = async () => {
		if (!id) return
		try {
			await deleteMut.mutateAsync(id)
			toast.success('Partner Connect deleted')
			navigate('/partner-connect')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete'))
		}
	}

	return {
		transaction,
		transactionId: id,
		isLoading,
		tab,
		setTab,
		isDeleting: deleteMut.isPending,
		handleDelete,
		goBack: () => navigate('/partner-connect'),
		goToEdit: () => navigate(`/partner-connect/${id}/edit`),
	}
}
