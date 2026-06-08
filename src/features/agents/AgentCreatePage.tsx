import { useNavigate } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { AgentForm } from './AgentForm'

export function AgentCreatePage() {
	const navigate = useNavigate()

	return (
		<FormPage title="New agent" onBack={() => navigate('/agents')}>
			<AgentForm
				onSuccess={(a) => navigate(`/agents/${a.id}`)}
				onCancel={() => navigate('/agents')}
			/>
		</FormPage>
	)
}
