import { useNavigate, useParams } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { useStatus } from './hooks'
import { StatusForm } from './StatusForm'

export function StatusEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const numericId = id ? Number(id) : undefined
	const { data: status, isLoading } = useStatus(numericId)

	return (
		<FormPage
			title="Edit status"
			onBack={() => navigate(`/statuses/${id}`)}
			isLoading={isLoading}
			ready={Boolean(status)}
			notFound={<p className="text-muted-foreground">Status not found</p>}
		>
			<StatusForm
				status={status}
				onSuccess={(s) => navigate(`/statuses/${s.id}`)}
				onCancel={() => navigate(`/statuses/${id}`)}
			/>
		</FormPage>
	)
}
