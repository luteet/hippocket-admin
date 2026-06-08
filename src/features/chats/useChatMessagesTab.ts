import { useNavigate } from 'react-router'

import { usePagination } from '@/hooks/usePagination'
import { useChatMessages } from './hooks'

// The messages list shown inside a chat's detail page, scoped to that chat.
export function useChatMessagesTab(chatId: string) {
	const navigate = useNavigate()
	const pagination = usePagination({
		count: 20,
		storageKey: 'chat-messages-tab',
	})

	const { data, isLoading, isFetching } = useChatMessages({
		offset: pagination.offset,
		count: pagination.count,
		chat_id: chatId,
	})

	return {
		data,
		isLoading,
		isFetching,
		pagination,
		openMessage: (id: string) => navigate(`/chats/messages/${id}`),
		goToCreate: () => navigate(`/chats/messages/new?chat=${chatId}`),
	}
}
