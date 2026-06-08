import { useNavigate, useParams } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { useAgent } from './hooks'
import { AgentForm } from './AgentForm'

export function AgentEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: agent, isLoading } = useAgent(id)

	return (
		<FormPage
			title="Edit agent"
			onBack={() => navigate(`/agents/${id}`)}
			isLoading={isLoading}
			ready={Boolean(agent)}
		>
			<AgentForm
				agent={agent}
				onSuccess={(a) => navigate(`/agents/${a.id}`)}
				onCancel={() => navigate(`/agents/${id}`)}
			/>
		</FormPage>
	)
}
