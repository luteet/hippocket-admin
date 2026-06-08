import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import { useGroup, useDeleteGroup } from './hooks'

export type GroupDetailTab = 'general' | 'theme'

export function useGroupDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const numericId = id ? Number(id) : undefined
	const { data: group, isLoading } = useGroup(numericId)
	const deleteMut = useDeleteGroup()
	const [tab, setTab] = useState<GroupDetailTab>('general')

	const handleDelete = async () => {
		if (numericId === undefined) return
		try {
			await deleteMut.mutateAsync(numericId)
			toast.success('Group deleted')
			navigate('/groups')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete'))
		}
	}

	return {
		group,
		isLoading,
		tab,
		setTab,
		isDeleting: deleteMut.isPending,
		handleDelete,
		goBack: () => navigate('/groups'),
		goToEdit: () => navigate(`/groups/${id}/edit`),
		openAgent: (agentId: string) => navigate(`/agents/${agentId}`),
	}
}
