import { useDetailPage, useDetailPageDelete } from '@/components/detail/useDetailPage'
import { useTeamLeader, useDeleteTeamLeader } from './hooks'

export function useTeamLeaderDetailPage() {
	const { id, onBack, onEdit } =
		useDetailPage({ basePath: '/team-leaders' })
	const { data: leader, isLoading } = useTeamLeader(id)
	const deleteMut = useDeleteTeamLeader()
	const { onDelete, isDeleting } = useDetailPageDelete(
		id,
		(id) => deleteMut.mutateAsync(id),
		deleteMut.isPending,
		{ basePath: '/team-leaders', successMessage: 'Team leader deleted' },
	)

	return {
		leader,
		isLoading,
		ready: Boolean(leader),
		onBack,
		onEdit,
		onDelete,
		isDeleting,
	}
}
