import { useNavigate, useParams } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { useGroup } from './hooks'
import { GroupForm } from './GroupForm'

export function GroupEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const numericId = id ? Number(id) : undefined
	const { data: group, isLoading } = useGroup(numericId)

	return (
		<FormPage
			title="Edit group"
			onBack={() => navigate(`/groups/${id}`)}
			isLoading={isLoading}
			ready={Boolean(group)}
		>
			<GroupForm
				group={group}
				onSuccess={(g) => navigate(`/groups/${g.id}`)}
				onCancel={() => navigate(`/groups/${id}`)}
			/>
		</FormPage>
	)
}
