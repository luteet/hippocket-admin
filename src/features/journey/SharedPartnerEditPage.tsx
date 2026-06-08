import { useNavigate, useParams } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { useSharedPartner } from './hooks'
import { SharedPartnerForm } from './SharedPartnerForm'

export function SharedPartnerEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: shared, isLoading } = useSharedPartner(id)

	return (
		<FormPage
			title="Edit shared partner"
			onBack={() => navigate(`/shared-partners/${id}`)}
			isLoading={isLoading}
			ready={Boolean(shared)}
		>
			<SharedPartnerForm
				shared={shared}
				onSuccess={(s) => navigate(`/shared-partners/${s.id}`)}
				onCancel={() => navigate(`/shared-partners/${id}`)}
			/>
		</FormPage>
	)
}
