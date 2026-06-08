import { useNavigate, useParams } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { useChat } from './hooks'
import { ChatForm } from './ChatForm'

export function ChatEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: chat, isLoading } = useChat(id)

	return (
		<FormPage
			title="Edit chat"
			onBack={() => navigate(`/chats/${id}`)}
			isLoading={isLoading}
			ready={Boolean(chat)}
		>
			<ChatForm
				chat={chat}
				onSuccess={(c) => navigate(`/chats/${c.id}`)}
				onCancel={() => navigate(`/chats/${id}`)}
			/>
		</FormPage>
	)
}
