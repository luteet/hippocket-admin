import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import { useTeamLeader, useDeleteTeamLeader } from './hooks'

export function useTeamLeaderDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: leader, isLoading } = useTeamLeader(id)
	const deleteMut = useDeleteTeamLeader()

	const handleDelete = async () => {
		if (!id) return
		try {
			await deleteMut.mutateAsync(id)
			toast.success('Team leader deleted')
			navigate('/team-leaders')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete'))
		}
	}

	return {
		leader,
		isLoading,
		isDeleting: deleteMut.isPending,
		handleDelete,
		goBack: () => navigate('/team-leaders'),
		goToEdit: () => navigate(`/team-leaders/${id}/edit`),
	}
}
