import { useNavigate } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { MessageForm } from './MessageForm'

export function MessageCreatePage() {
	const navigate = useNavigate()

	return (
		<FormPage
			title="New message"
			onBack={() => navigate('/ai-chat/messages')}
		>
			<MessageForm
				onSuccess={(m) => navigate(`/ai-chat/messages/${m.id}`)}
				onCancel={() => navigate('/ai-chat/messages')}
			/>
		</FormPage>
	)
}
