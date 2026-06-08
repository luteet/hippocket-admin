import { useNavigate, useParams } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { useChatMessage } from './hooks'
import { ChatMessageForm } from './ChatMessageForm'

export function ChatMessageEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: message, isLoading } = useChatMessage(id)

	return (
		<FormPage
			title="Edit message"
			onBack={() => navigate(`/chats/messages/${id}`)}
			isLoading={isLoading}
			ready={Boolean(message)}
		>
			<ChatMessageForm
				message={message}
				onSuccess={(m) => navigate(`/chats/messages/${m.id}`)}
				onCancel={() => navigate(`/chats/messages/${id}`)}
			/>
		</FormPage>
	)
}
