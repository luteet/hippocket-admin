import { useNavigate } from 'react-router'

import { useDetailPage, useDetailPageDelete } from '@/components/detail/useDetailPage'
import { useChatMedia, useDeleteChatMedia } from './hooks'

export function useChatMediaDetailPage() {
	const { id, onBack } =
		useDetailPage({ basePath: '/chats/media' })
	const navigate = useNavigate()
	const { data: media, isLoading } = useChatMedia(id)
	const deleteMut = useDeleteChatMedia()
	const { onDelete, isDeleting } = useDetailPageDelete(
		id,
		(id) => deleteMut.mutateAsync(id),
		deleteMut.isPending,
		{ basePath: '/chats/media', successMessage: 'Media deleted' },
	)

	return {
		media,
		isLoading,
		ready: Boolean(media),
		onBack,
		onDelete,
		isDeleting,
		goToMessage: () =>
			media?.message_id &&
			navigate(`/chats/messages/${media.message_id}`),
	}
}
