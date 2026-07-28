import { useDetailPage, useDetailPageDelete } from '@/components/detail/useDetailPage'
import { useChat, useDeleteChat } from './hooks'

export function useChatDetailPage() {
	const { id, onBack, onEdit, activeTab, onTabChange } =
		useDetailPage({ basePath: '/chats', tabKeys: ['general', 'messages'] as const })
	const { data: chat, isLoading } = useChat(id)
	const deleteMut = useDeleteChat()
	const { onDelete, isDeleting } = useDetailPageDelete(
		id,
		(id) => deleteMut.mutateAsync(id),
		deleteMut.isPending,
		{ basePath: '/chats', successMessage: 'Chat deleted' },
	)

	return {
		chat,
		chatId: id,
		isLoading,
		ready: Boolean(chat),
		onBack,
		onEdit,
		activeTab,
		onTabChange,
		onDelete,
		isDeleting,
	}
}
