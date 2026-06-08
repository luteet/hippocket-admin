import { useNavigate } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { TeamLeaderForm } from './TeamLeaderForm'

export function TeamLeaderCreatePage() {
	const navigate = useNavigate()

	return (
		<FormPage
			title="New team leader"
			onBack={() => navigate('/team-leaders')}
		>
			<TeamLeaderForm
				onSuccess={(t) => navigate(`/team-leaders/${t.id}`)}
				onCancel={() => navigate('/team-leaders')}
			/>
		</FormPage>
	)
}
