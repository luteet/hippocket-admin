import { useDetailPage, useDetailPageDelete } from '@/components/detail/useDetailPage'
import { useAgent, useDeleteAgent } from './hooks'

export function useAgentDetailPage() {
	const { id, onBack, onEdit } =
		useDetailPage({ basePath: '/agents' })
	const { data: agent, isLoading } = useAgent(id)
	const deleteMut = useDeleteAgent()
	const { onDelete, isDeleting } = useDetailPageDelete(
		id,
		(id) => deleteMut.mutateAsync(id),
		deleteMut.isPending,
		{ basePath: '/agents', successMessage: 'Agent deleted' },
	)

	return {
		agent,
		isLoading,
		ready: Boolean(agent),
		onBack,
		onEdit,
		onDelete,
		isDeleting,
	}
}
