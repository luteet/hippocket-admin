import { useNavigate } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { StatusForm } from './StatusForm'

export function StatusCreatePage() {
	const navigate = useNavigate()

	return (
		<FormPage title="New status" onBack={() => navigate('/statuses')}>
			<StatusForm
				onSuccess={(s) => navigate(`/statuses/${s.id}`)}
				onCancel={() => navigate('/statuses')}
			/>
		</FormPage>
	)
}
