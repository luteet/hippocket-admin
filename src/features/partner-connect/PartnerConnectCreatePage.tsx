import { useNavigate } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { PartnerConnectForm } from './PartnerConnectForm'

export function PartnerConnectCreatePage() {
	const navigate = useNavigate()

	return (
		<FormPage title="New partner connect" onBack={() => navigate('/partner-connect')}>
			<PartnerConnectForm
				onSuccess={(t) => navigate(`/partner-connect/${t.id}`)}
				onCancel={() => navigate('/partner-connect')}
			/>
		</FormPage>
	)
}
