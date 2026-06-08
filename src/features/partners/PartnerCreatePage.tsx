import { useNavigate } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { PartnerForm } from './PartnerForm'

export function PartnerCreatePage() {
	const navigate = useNavigate()

	return (
		<FormPage title="New partner" onBack={() => navigate('/partners')}>
			<PartnerForm
				onSuccess={(p) => navigate(`/partners/${p.id}`)}
				onCancel={() => navigate('/partners')}
			/>
		</FormPage>
	)
}
