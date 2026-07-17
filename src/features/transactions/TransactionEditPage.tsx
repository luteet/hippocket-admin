import { useNavigate, useParams } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { useTransaction } from './hooks'
import { TransactionForm } from './TransactionForm'

export function TransactionEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: transaction, isLoading } = useTransaction(id)

	return (
		<FormPage
			title="Edit transaction"
			onBack={() => navigate(`/transactions/${id}`)}
			isLoading={isLoading}
			ready={Boolean(transaction)}
		>
			<TransactionForm
				transaction={transaction}
				onSuccess={(t) => navigate(`/transactions/${t.id}`)}
				onCancel={() => navigate(`/transactions/${id}`)}
			/>
		</FormPage>
	)
}
