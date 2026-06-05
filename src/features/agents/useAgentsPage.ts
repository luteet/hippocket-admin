import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { usePagination } from '@/hooks/usePagination'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { AgentRole, AgentStatus } from '@/types/api'
import { useAgents } from './hooks'

export const ALL = '__all__'

export const ROLE_OPTIONS: { value: AgentRole; label: string }[] = [
	{ value: 'source', label: 'Source' },
	{ value: 'partner', label: 'Partner' },
	{ value: 'buyer', label: 'Buyer' },
]

export const STATUS_OPTIONS: { value: AgentStatus; label: string }[] = [
	{ value: 'agent', label: 'Agent' },
	{ value: 'apartment', label: 'Apartment' },
	{ value: 'real', label: 'Real' },
	{ value: 'service', label: 'Service' },
	{ value: 'referral', label: 'Referral' },
]

export const ACTIVE_OPTIONS = [
	{ value: ALL, label: 'All' },
	{ value: 'true', label: 'Active' },
	{ value: 'false', label: 'Inactive' },
]

export function useAgentsPage() {
	const navigate = useNavigate()
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search)
	const [role, setRole] = useState(ALL)
	const [status, setStatus] = useState(ALL)
	const [isActive, setIsActive] = useState(ALL)
	const pagination = usePagination({ count: 20, storageKey: 'agents' })

	// Reset to the first page when any filter changes.
	useEffect(() => {
		pagination.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch, role, status, isActive])

	const { data, isLoading, isFetching } = useAgents({
		offset: pagination.offset,
		count: pagination.count,
		search: debouncedSearch || undefined,
		role: role === ALL ? undefined : (role as AgentRole),
		status: status === ALL ? undefined : (status as AgentStatus),
		is_active: isActive === ALL ? undefined : isActive === 'true',
	})

	return {
		search,
		setSearch,
		role,
		setRole,
		status,
		setStatus,
		isActive,
		setIsActive,
		data,
		isLoading,
		isFetching,
		pagination,
		goToCreate: () => navigate('/agents/new'),
		openAgent: (id: string) => navigate(`/agents/${id}`),
	}
}
