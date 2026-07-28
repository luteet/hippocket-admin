import { useNavigate } from 'react-router'

import { useDetailPage, useDetailPageDelete } from '@/components/detail/useDetailPage'
import { useGroup, useDeleteGroup } from './hooks'

export function useGroupDetailPage() {
	const { id, onBack, onEdit, activeTab, onTabChange } =
		useDetailPage({ basePath: '/groups', tabKeys: ['general', 'theme'] as const })
	const numericId = id ? Number(id) : undefined
	const { data: group, isLoading } = useGroup(numericId)
	const deleteMut = useDeleteGroup()
	const { onDelete, isDeleting } = useDetailPageDelete(
		numericId !== undefined ? id : undefined,
		(_id) => deleteMut.mutateAsync(numericId!),
		deleteMut.isPending,
		{ basePath: '/groups', successMessage: 'Group deleted' },
	)
	const navigate = useNavigate()

	return {
		group,
		isLoading,
		ready: Boolean(group),
		onBack,
		onEdit,
		activeTab,
		onTabChange,
		onDelete,
		isDeleting,
		openAgent: (agentId: string) => navigate(`/agents/${agentId}`),
	}
}
