import { useNavigate, useParams } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { useMessage } from './hooks'
import { MessageForm } from './MessageForm'

export function MessageEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: message, isLoading } = useMessage(id)

	return (
		<FormPage
			title="Edit message"
			onBack={() => navigate(`/ai-chat/messages/${id}`)}
			isLoading={isLoading}
			ready={Boolean(message)}
		>
			<MessageForm
				message={message}
				onSuccess={(m) => navigate(`/ai-chat/messages/${m.id}`)}
				onCancel={() => navigate(`/ai-chat/messages/${id}`)}
			/>
		</FormPage>
	)
}
