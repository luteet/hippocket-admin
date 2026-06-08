import { useNavigate, useParams } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { useWithdrawal } from './hooks'
import { WithdrawalForm } from './WithdrawalForm'

export function WithdrawalEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: withdrawal, isLoading } = useWithdrawal(id)

	return (
		<FormPage
			title="Edit withdrawal"
			onBack={() => navigate(`/withdrawals/${id}`)}
			isLoading={isLoading}
			ready={Boolean(withdrawal)}
			notFound={
				<p className="text-muted-foreground">Withdrawal not found</p>
			}
		>
			<WithdrawalForm
				withdrawal={withdrawal}
				onSuccess={(w) => navigate(`/withdrawals/${w.id}`)}
				onCancel={() => navigate(`/withdrawals/${id}`)}
			/>
		</FormPage>
	)
}
