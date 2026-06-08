import { useNavigate, useParams } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { usePartner } from './hooks'
import { PartnerForm } from './PartnerForm'

export function PartnerEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: partner, isLoading } = usePartner(id)

	return (
		<FormPage
			title="Edit partner"
			onBack={() => navigate(`/partners/${id}`)}
			isLoading={isLoading}
			ready={Boolean(partner)}
		>
			<PartnerForm
				partner={partner}
				onSuccess={(p) => navigate(`/partners/${p.id}`)}
				onCancel={() => navigate(`/partners/${id}`)}
			/>
		</FormPage>
	)
}
