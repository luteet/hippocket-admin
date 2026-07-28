import { useNavigate, useParams } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { useTransaction } from './hooks'
import { PartnerConnectForm } from './PartnerConnectForm'

export function PartnerConnectEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: transaction, isLoading } = useTransaction(id)

	return (
		<FormPage
			title="Edit partner connect"
			onBack={() => navigate(`/partner-connect/${id}`)}
			isLoading={isLoading}
			ready={Boolean(transaction)}
		>
			<PartnerConnectForm
				transaction={transaction}
				onSuccess={(t) => navigate(`/partner-connect/${t.id}`)}
				onCancel={() => navigate(`/partner-connect/${id}`)}
			/>
		</FormPage>
	)
}
