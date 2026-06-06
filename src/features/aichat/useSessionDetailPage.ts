import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import { useDeleteSession, useSession } from './hooks'

export function useSessionDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: session, isLoading } = useSession(id)
	const deleteMut = useDeleteSession()
	const [confirmOpen, setConfirmOpen] = useState(false)

	const handleDelete = async () => {
		if (!id) return
		try {
			await deleteMut.mutateAsync(id)
			toast.success('Session deleted')
			navigate('/ai-chat/sessions')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete'))
		}
	}

	return {
		session,
		isLoading,
		confirmOpen,
		setConfirmOpen,
		isDeleting: deleteMut.isPending,
		handleDelete,
		goBack: () => navigate('/ai-chat/sessions'),
		goToMessages: () => navigate(`/ai-chat/messages?session=${id}`),
	}
}
