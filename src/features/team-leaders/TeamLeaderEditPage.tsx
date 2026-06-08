import { useNavigate, useParams } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { useTeamLeader } from './hooks'
import { TeamLeaderForm } from './TeamLeaderForm'

export function TeamLeaderEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: leader, isLoading } = useTeamLeader(id)

	return (
		<FormPage
			title="Edit team leader"
			onBack={() => navigate(`/team-leaders/${id}`)}
			isLoading={isLoading}
			ready={Boolean(leader)}
			notFound={
				<p className="text-muted-foreground">Team leader not found</p>
			}
		>
			<TeamLeaderForm
				leader={leader}
				onSuccess={(t) => navigate(`/team-leaders/${t.id}`)}
				onCancel={() => navigate(`/team-leaders/${id}`)}
			/>
		</FormPage>
	)
}
