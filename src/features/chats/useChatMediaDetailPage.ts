import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import { useChatMedia, useDeleteChatMedia } from './hooks'

export function useChatMediaDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: media, isLoading } = useChatMedia(id)
	const deleteMut = useDeleteChatMedia()

	const handleDelete = async () => {
		if (!id) return
		try {
			await deleteMut.mutateAsync(id)
			toast.success('Media deleted')
			navigate('/chats/media')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to delete'))
		}
	}

	return {
		media,
		isLoading,
		isDeleting: deleteMut.isPending,
		handleDelete,
		goBack: () => navigate('/chats/media'),
		goToMessage: () =>
			media?.message_id &&
			navigate(`/chats/messages/${media.message_id}`),
	}
}
