import { useNavigate, useParams } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { useCashOffersEmail } from './hooks'
import { CashOffersEmailForm } from './CashOffersEmailForm'

export function CashOffersEmailEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: email, isLoading } = useCashOffersEmail(id)

	return (
		<FormPage
			title="Edit email"
			onBack={() => navigate(`/cash-offers-emails/${id}`)}
			isLoading={isLoading}
			ready={Boolean(email)}
		>
			<CashOffersEmailForm
				email={email}
				onSuccess={(e) => navigate(`/cash-offers-emails/${e.id}`)}
				onCancel={() => navigate(`/cash-offers-emails/${id}`)}
			/>
		</FormPage>
	)
}
