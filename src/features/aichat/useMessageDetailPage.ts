import { useNavigate } from 'react-router'

import { useDetailPage, useDetailPageDelete } from '@/components/detail/useDetailPage'
import { useDeleteMessage, useMessage } from './hooks'

export function useMessageDetailPage() {
	const { id, onBack, onEdit } =
		useDetailPage({ basePath: '/ai-chat/messages' })
	const navigate = useNavigate()
	const { data: message, isLoading } = useMessage(id)
	const deleteMut = useDeleteMessage()
	const { onDelete, isDeleting } = useDetailPageDelete(
		id,
		(id) => deleteMut.mutateAsync(id),
		deleteMut.isPending,
		{ basePath: '/ai-chat/messages', successMessage: 'Message deleted' },
	)

	return {
		message,
		isLoading,
		ready: Boolean(message),
		onBack,
		onEdit,
		onDelete,
		isDeleting,
		goToSession: () =>
			message && navigate(`/ai-chat/sessions/${message.session_id}`),
	}
}
