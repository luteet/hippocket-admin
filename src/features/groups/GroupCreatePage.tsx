import { useNavigate } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { GroupForm } from './GroupForm'

export function GroupCreatePage() {
	const navigate = useNavigate()

	return (
		<FormPage title="New group" onBack={() => navigate('/groups')}>
			<GroupForm
				onSuccess={(g) => navigate(`/groups/${g.id}`)}
				onCancel={() => navigate('/groups')}
			/>
		</FormPage>
	)
}
