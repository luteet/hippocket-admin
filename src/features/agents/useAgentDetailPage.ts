import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import { useAgent, useDeleteAgent } from './hooks'

export function useAgentDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: agent, isLoading } = useAgent(id)
	const deleteMut = useDeleteAgent()

	const handleDelete = async () => {
		if (!id) return
		try {
			await deleteMut.mutateAsync(id)
			toast.success('Agent deleted')
			navigate('/agents')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete'))
		}
	}

	return {
		agent,
		isLoading,
		isDeleting: deleteMut.isPending,
		handleDelete,
		goBack: () => navigate('/agents'),
		goToEdit: () => navigate(`/agents/${id}/edit`),
	}
}
