import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import { useDeleteMessage, useMessage } from './hooks'

export function useMessageDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: message, isLoading } = useMessage(id)
	const deleteMut = useDeleteMessage()
	const [confirmOpen, setConfirmOpen] = useState(false)

	const handleDelete = async () => {
		if (!id) return
		try {
			await deleteMut.mutateAsync(id)
			toast.success('Message deleted')
			navigate('/ai-chat/messages')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete'))
		}
	}

	return {
		message,
		isLoading,
		confirmOpen,
		setConfirmOpen,
		isDeleting: deleteMut.isPending,
		handleDelete,
		goBack: () => navigate('/ai-chat/messages'),
		goToEdit: () => navigate(`/ai-chat/messages/${id}/edit`),
		goToSession: () =>
			message && navigate(`/ai-chat/sessions/${message.session_id}`),
	}
}
