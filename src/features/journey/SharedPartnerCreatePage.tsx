import { useNavigate } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { SharedPartnerForm } from './SharedPartnerForm'

export function SharedPartnerCreatePage() {
	const navigate = useNavigate()

	return (
		<FormPage
			title="New shared partner"
			onBack={() => navigate('/shared-partners')}
		>
			<SharedPartnerForm
				onSuccess={(s) => navigate(`/shared-partners/${s.id}`)}
				onCancel={() => navigate('/shared-partners')}
			/>
		</FormPage>
	)
}
