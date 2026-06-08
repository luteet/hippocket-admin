import { useNavigate } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { WithdrawalForm } from './WithdrawalForm'

export function WithdrawalCreatePage() {
	const navigate = useNavigate()

	return (
		<FormPage
			title="New withdrawal"
			onBack={() => navigate('/withdrawals')}
		>
			<WithdrawalForm
				onSuccess={(w) => navigate(`/withdrawals/${w.id}`)}
				onCancel={() => navigate('/withdrawals')}
			/>
		</FormPage>
	)
}
