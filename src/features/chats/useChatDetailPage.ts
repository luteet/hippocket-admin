import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import { useChat, useDeleteChat } from './hooks'

export type ChatDetailTab = 'general' | 'messages'

export function useChatDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: chat, isLoading } = useChat(id)
	const deleteMut = useDeleteChat()
	const [confirmOpen, setConfirmOpen] = useState(false)
	const [tab, setTab] = useState<ChatDetailTab>('general')

	const handleDelete = async () => {
		if (!id) return
		try {
			await deleteMut.mutateAsync(id)
			toast.success('Chat deleted')
			navigate('/chats')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete'))
		}
	}

	return {
		chat,
		chatId: id,
		isLoading,
		tab,
		setTab,
		confirmOpen,
		setConfirmOpen,
		isDeleting: deleteMut.isPending,
		handleDelete,
		goBack: () => navigate('/chats'),
		goToEdit: () => navigate(`/chats/${id}/edit`),
	}
}
