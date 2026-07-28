import { useNavigate } from 'react-router'

import { useDetailPage, useDetailPageDelete } from '@/components/detail/useDetailPage'
import { useDeleteSession, useSession } from './hooks'

export function useSessionDetailPage() {
	const { id, onBack } =
		useDetailPage({ basePath: '/ai-chat/sessions' })
	const navigate = useNavigate()
	const { data: session, isLoading } = useSession(id)
	const deleteMut = useDeleteSession()
	const { onDelete, isDeleting } = useDetailPageDelete(
		id,
		(id) => deleteMut.mutateAsync(id),
		deleteMut.isPending,
		{ basePath: '/ai-chat/sessions', successMessage: 'Session deleted' },
	)

	return {
		session,
		isLoading,
		ready: Boolean(session),
		onBack,
		onDelete,
		isDeleting,
		goToMessages: () => navigate(`/ai-chat/messages?session=${id}`),
	}
}
