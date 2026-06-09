import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { usePagination } from '@/hooks/usePagination'
import { useSorting } from '@/hooks/useSorting'
import { useChatMediaList } from './hooks'

export function useChatMediaPage() {
	const navigate = useNavigate()
	const pagination = usePagination({ count: 20, storageKey: 'chat-media' })
	const sorting = useSorting({
		defaultSortBy: 'created_at',
		defaultOrder: 'desc',
	})

	// Reset to the first page when the sort changes.
	useEffect(() => {
		pagination.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sorting.sortBy, sorting.order])

	const { data, isLoading, isFetching } = useChatMediaList({
		offset: pagination.offset,
		count: pagination.count,
		sort_by: sorting.sortBy,
		order: sorting.order,
	})

	return {
		data,
		isLoading,
		isFetching,
		pagination,
		sorting,
		openMedia: (id: string) => navigate(`/chats/media/${id}`),
	}
}
