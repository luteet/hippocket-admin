import { useNavigate, useSearchParams } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { ChatMessageForm } from './ChatMessageForm'

export function ChatMessageCreatePage() {
	const navigate = useNavigate()
	// A chat may be pre-selected via `?chat=…` (e.g. from a chat's Messages tab).
	const [searchParams] = useSearchParams()
	const initialChatId = searchParams.get('chat') ?? undefined

	return (
		<FormPage
			title="New message"
			onBack={() => navigate('/chats/messages')}
		>
			<ChatMessageForm
				initialChatId={initialChatId}
				onSuccess={(m) => navigate(`/chats/messages/${m.id}`)}
				onCancel={() => navigate('/chats/messages')}
			/>
		</FormPage>
	)
}
