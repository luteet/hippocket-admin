import { useNavigate } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { CashOffersEmailForm } from './CashOffersEmailForm'

export function CashOffersEmailCreatePage() {
	const navigate = useNavigate()

	return (
		<FormPage
			title="New email"
			onBack={() => navigate('/cash-offers-emails')}
		>
			<CashOffersEmailForm
				onSuccess={(e) => navigate(`/cash-offers-emails/${e.id}`)}
				onCancel={() => navigate('/cash-offers-emails')}
			/>
		</FormPage>
	)
}
