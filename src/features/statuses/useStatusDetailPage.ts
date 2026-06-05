import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import { useStatus, useDeleteStatus } from './hooks'

export function useStatusDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const numericId = id ? Number(id) : undefined
	const { data: status, isLoading } = useStatus(numericId)
	const deleteMut = useDeleteStatus()
	const [confirmOpen, setConfirmOpen] = useState(false)

	const handleDelete = async () => {
		if (numericId === undefined) return
		try {
			await deleteMut.mutateAsync(numericId)
			toast.success('Status deleted')
			navigate('/statuses')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete'))
		}
	}

	return {
		status,
		isLoading,
		confirmOpen,
		setConfirmOpen,
		isDeleting: deleteMut.isPending,
		handleDelete,
		goBack: () => navigate('/statuses'),
		goToEdit: () => navigate(`/statuses/${id}/edit`),
	}
}
