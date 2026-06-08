import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import { useChatMessage, useDeleteChatMessage } from './hooks'

export function useChatMessageDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: message, isLoading } = useChatMessage(id)
	const deleteMut = useDeleteChatMessage()

	const handleDelete = async () => {
		if (!id) return
		try {
			await deleteMut.mutateAsync(id)
			toast.success('Message deleted')
			navigate('/chats/messages')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete'))
		}
	}

	return {
		message,
		isLoading,
		isDeleting: deleteMut.isPending,
		handleDelete,
		goBack: () => navigate('/chats/messages'),
		goToEdit: () => navigate(`/chats/messages/${id}/edit`),
		goToChat: () => message && navigate(`/chats/${message.chat_id}`),
	}
}
