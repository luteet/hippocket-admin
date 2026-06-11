import { useNavigate } from 'react-router'

import { usePagination } from '@/hooks/usePagination'
import { useSorting } from '@/hooks/useSorting'
import { useUrlParams, useUrlSearch } from '@/hooks/useUrlState'
import type { ActiveFilter } from '@/components/list/FilterChips'
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
	// Search, filters (role, session), sort and page all live in the URL. The
	// session can also be pre-set via `?session=…` (e.g. from a session detail) —
	// it's the same param. Changing search/filters resets the page in one write.
	const [params, setParams] = useUrlParams()
	// Instant local input, debounced URL write; `committedSearch` (the URL value)
	// drives the query. See useUrlSearch.
	const [search, setSearch, committedSearch] = useUrlSearch('q')
	const role = params.get('role') ?? ALL
	const setRole = (value: string) =>
		setParams({ role: value === ALL ? null : value, page: null })
	const sessionId = params.get('session') ?? ALL
	const setSessionId = (value: string) =>
		setParams({ session: value === ALL ? null : value, page: null })
	const pagination = usePagination({
		count: 20,
		storageKey: 'ai-messages',
		syncToUrl: true,
	})
	const sorting = useSorting({
		defaultSortBy: 'created_at',
		defaultOrder: 'desc',
		syncToUrl: true,
	})

	const { data: sessionRefs, isLoading: sessionsLoading } = useSessionRefs()

	// Active filters as chips (Role / Session), resolved to human labels. A stale
	// session id with no matching ref still renders (truncated id) so it can be
	// cleared. The badge count is derived from this list.
	const session = sessionRefs?.find((s) => s.id === sessionId)
	const activeFilters: ActiveFilter[] = [
		role !== ALL && {
			key: 'role',
			label: 'Role',
			value: ROLE_OPTIONS.find((o) => o.value === role)?.label ?? role,
		},
		sessionId !== ALL && {
			key: 'session',
			label: 'Session',
			value: session
				? `${session.user_email} · ${session.id.slice(0, 8)}`
				: sessionId.slice(0, 8),
		},
	].filter(Boolean) as ActiveFilter[]

	const activeFilterCount = activeFilters.length
	const removeFilter = (key: string) => setParams({ [key]: null, page: null })
	const clearFilters = () =>
		setParams({ role: null, session: null, page: null })

	const { data, isLoading, isFetching, refetch } = useMessages({
		offset: pagination.offset,
		count: pagination.count,
		search: committedSearch || undefined,
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
		activeFilters,
		removeFilter,
		clearFilters,
		sessionRefs: sessionRefs ?? [],
		sessionsLoading,
		data,
		isLoading,
		isFetching,
		onRefresh: () => void refetch(),
		pagination,
		sorting,
		goToCreate: () => navigate('/ai-chat/messages/new'),
		openMessage: (id: string) => navigate(`/ai-chat/messages/${id}`),
	}
}
