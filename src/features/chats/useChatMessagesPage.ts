import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { usePagination } from '@/hooks/usePagination'
import { useSorting } from '@/hooks/useSorting'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useChatMessages, useChatRefs } from './hooks'

export const ALL = '__all__'

export const READ_OPTIONS: { value: string; label: string }[] = [
	{ value: 'read', label: 'Read' },
	{ value: 'unread', label: 'Unread' },
]

export function useChatMessagesPage() {
	const navigate = useNavigate()
	// A chat id may be pre-set via `?chat=…` (e.g. from a chat detail).
	const [searchParams] = useSearchParams()
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search)
	const [readState, setReadState] = useState(ALL)
	const [chatId, setChatId] = useState(() => searchParams.get('chat') ?? ALL)
	const pagination = usePagination({ count: 20, storageKey: 'chat-messages' })
	const sorting = useSorting({
		defaultSortBy: 'created_at',
		defaultOrder: 'desc',
	})

	const { data: chatRefs, isLoading: chatsLoading } = useChatRefs()

	// How many popover filters are set — shown as a badge on the Filters button.
	const activeFilterCount =
		(readState !== ALL ? 1 : 0) + (chatId !== ALL ? 1 : 0)
	const clearFilters = () => {
		setReadState(ALL)
		setChatId(ALL)
	}

	// Reset to the first page when any filter changes.
	useEffect(() => {
		pagination.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch, readState, chatId, sorting.sortBy, sorting.order])

	const { data, isLoading, isFetching, refetch } = useChatMessages({
		offset: pagination.offset,
		count: pagination.count,
		search: debouncedSearch || undefined,
		chat_id: chatId === ALL ? undefined : chatId,
		is_read: readState === ALL ? undefined : readState === 'read',
		sort_by: sorting.sortBy,
		order: sorting.order,
	})

	return {
		search,
		setSearch,
		readState,
		setReadState,
		chatId,
		setChatId,
		activeFilterCount,
		clearFilters,
		chatRefs: chatRefs ?? [],
		chatsLoading,
		data,
		isLoading,
		isFetching,
		onRefresh: () => void refetch(),
		pagination,
		sorting,
		goToCreate: () => navigate('/chats/messages/new'),
		openMessage: (id: string) => navigate(`/chats/messages/${id}`),
	}
}
