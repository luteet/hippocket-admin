import { useNavigate, useParams } from 'react-router'

import { useAgent } from './hooks'

export function useAgentDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: agent, isLoading } = useAgent(id)

	return {
		agent,
		isLoading,
		goBack: () => navigate('/agents'),
	}
}
