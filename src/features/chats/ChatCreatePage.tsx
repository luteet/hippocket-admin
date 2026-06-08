import { useNavigate } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { ChatForm } from './ChatForm'

export function ChatCreatePage() {
	const navigate = useNavigate()

	return (
		<FormPage title="New chat" onBack={() => navigate('/chats')}>
			<ChatForm
				onSuccess={(c) => navigate(`/chats/${c.id}`)}
				onCancel={() => navigate('/chats')}
			/>
		</FormPage>
	)
}
