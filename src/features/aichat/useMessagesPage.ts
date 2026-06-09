import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { usePagination } from '@/hooks/usePagination'
import { useSorting } from '@/hooks/useSorting'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { AiMessageRole } from '@/types/api'
import { useMessages, useSessionRefs } from './hooks'

export const ALL = '__all__'

export const ROLE_OPTIONS: { value: AiMessageRole; label: string }[] = [
	{ value: 'user', label: 'User' },
	{ value: 'assistant', label: 'Assistant' },
	{ value: 'function', label: 'Function' },
	{ value: 'tool', label: 'Tool' },
]

export function useMessagesPage() {
	const navigate = useNavigate()
	// A session id may be pre-set via `?session=…` (e.g. from a session detail).
	const [searchParams] = useSearchParams()
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search)
	const [role, setRole] = useState(ALL)
	const [sessionId, setSessionId] = useState(
		() => searchParams.get('session') ?? ALL,
	)
	const pagination = usePagination({ count: 20, storageKey: 'ai-messages' })
	const sorting = useSorting({
		defaultSortBy: 'created_at',
		defaultOrder: 'desc',
	})

	const { data: sessionRefs, isLoading: sessionsLoading } = useSessionRefs()

	// How many popover filters are set — shown as a badge on the Filters button.
	const activeFilterCount =
		(role !== ALL ? 1 : 0) + (sessionId !== ALL ? 1 : 0)
	const clearFilters = () => {
		setRole(ALL)
		setSessionId(ALL)
	}

	// Reset to the first page when any filter changes.
	useEffect(() => {
		pagination.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch, role, sessionId, sorting.sortBy, sorting.order])

	const { data, isLoading, isFetching } = useMessages({
		offset: pagination.offset,
		count: pagination.count,
		search: debouncedSearch || undefined,
		role: role === ALL ? undefined : (role as AiMessageRole),
		session_id: sessionId === ALL ? undefined : sessionId,
		sort_by: sorting.sortBy,
		order: sorting.order,
	})

	return {
		search,
		setSearch,
		role,
		setRole,
		sessionId,
		setSessionId,
		activeFilterCount,
		clearFilters,
		sessionRefs: sessionRefs ?? [],
		sessionsLoading,
		data,
		isLoading,
		isFetching,
		pagination,
		sorting,
		goToCreate: () => navigate('/ai-chat/messages/new'),
		openMessage: (id: string) => navigate(`/ai-chat/messages/${id}`),
	}
}
