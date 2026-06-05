import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { useGroup } from './hooks'

export type GroupDetailTab = 'general' | 'theme'

export function useGroupDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const numericId = id ? Number(id) : undefined
	const { data: group, isLoading } = useGroup(numericId)
	const [tab, setTab] = useState<GroupDetailTab>('general')

	return {
		group,
		isLoading,
		tab,
		setTab,
		goBack: () => navigate('/groups'),
		openAgent: (agentId: string) => navigate(`/agents/${agentId}`),
	}
}
