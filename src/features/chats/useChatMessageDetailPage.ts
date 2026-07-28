import { useNavigate } from 'react-router'

import { useDetailPage, useDetailPageDelete } from '@/components/detail/useDetailPage'
import { useChatMessage, useDeleteChatMessage } from './hooks'

export function useChatMessageDetailPage() {
	const { id, onBack, onEdit } =
		useDetailPage({ basePath: '/chats/messages' })
	const navigate = useNavigate()
	const { data: message, isLoading } = useChatMessage(id)
	const deleteMut = useDeleteChatMessage()
	const { onDelete, isDeleting } = useDetailPageDelete(
		id,
		(id) => deleteMut.mutateAsync(id),
		deleteMut.isPending,
		{ basePath: '/chats/messages', successMessage: 'Message deleted' },
	)

	return {
		message,
		isLoading,
		ready: Boolean(message),
		onBack,
		onEdit,
		onDelete,
		isDeleting,
		goToChat: () => message && navigate(`/chats/${message.chat_id}`),
	}
}
