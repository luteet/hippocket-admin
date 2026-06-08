import { useNavigate } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { SessionForm } from './SessionForm'

export function SessionCreatePage() {
	const navigate = useNavigate()

	return (
		<FormPage
			title="New session"
			onBack={() => navigate('/ai-chat/sessions')}
		>
			<SessionForm
				onSuccess={(s) => navigate(`/ai-chat/sessions/${s.id}`)}
				onCancel={() => navigate('/ai-chat/sessions')}
			/>
		</FormPage>
	)
}
