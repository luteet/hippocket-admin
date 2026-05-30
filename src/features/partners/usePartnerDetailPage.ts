import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import { usePartner, useDeletePartner } from './hooks'

export function usePartnerDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: partner, isLoading } = usePartner(id)
	const deleteMut = useDeletePartner()
	const [confirmOpen, setConfirmOpen] = useState(false)

	const handleDelete = async () => {
		if (!id) return
		try {
			await deleteMut.mutateAsync(id)
			toast.success('Partner deleted')
			navigate('/partners')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete'))
		}
	}

	return {
		partner,
		isLoading,
		confirmOpen,
		setConfirmOpen,
		isDeleting: deleteMut.isPending,
		handleDelete,
		goBack: () => navigate('/partners'),
		goToEdit: () => navigate(`/partners/${id}/edit`),
	}
}
