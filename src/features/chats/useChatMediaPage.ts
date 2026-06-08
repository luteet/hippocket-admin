import { useNavigate } from 'react-router'

import { usePagination } from '@/hooks/usePagination'
import { useChatMediaList } from './hooks'

export function useChatMediaPage() {
	const navigate = useNavigate()
	const pagination = usePagination({ count: 20, storageKey: 'chat-media' })

	const { data, isLoading, isFetching } = useChatMediaList({
		offset: pagination.offset,
		count: pagination.count,
	})

	return {
		data,
		isLoading,
		isFetching,
		pagination,
		openMedia: (id: string) => navigate(`/chats/media/${id}`),
	}
}
