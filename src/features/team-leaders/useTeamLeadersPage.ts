import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { usePagination } from '@/hooks/usePagination'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useGroupOptions } from '@/features/agents/hooks'
import { useTeamLeaders } from './hooks'

export const ALL = '__all__'

export function useTeamLeadersPage() {
	const navigate = useNavigate()
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search)
	// The group filter holds the numeric id as a string (or ALL) — the shadcn
	// Select works with strings.
	const [groupId, setGroupId] = useState(ALL)
	const pagination = usePagination({ count: 20, storageKey: 'team-leaders' })

	const { data: groupOptions } = useGroupOptions()

	const activeFilterCount = groupId !== ALL ? 1 : 0
	const clearFilters = () => setGroupId(ALL)

	// Reset to the first page when any filter changes.
	useEffect(() => {
		pagination.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch, groupId])

	const { data, isLoading, isFetching } = useTeamLeaders({
		offset: pagination.offset,
		count: pagination.count,
		search: debouncedSearch || undefined,
		group_id: groupId === ALL ? undefined : Number(groupId),
	})

	return {
		search,
		setSearch,
		groupId,
		setGroupId,
		groupOptions: groupOptions ?? [],
		activeFilterCount,
		clearFilters,
		data,
		isLoading,
		isFetching,
		pagination,
		openTeamLeader: (id: string) => navigate(`/team-leaders/${id}`),
		goToCreate: () => navigate('/team-leaders/new'),
	}
}
