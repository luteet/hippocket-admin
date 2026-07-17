import { useNavigate } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { TransactionForm } from './TransactionForm'

export function TransactionCreatePage() {
	const navigate = useNavigate()

	return (
		<FormPage title="New transaction" onBack={() => navigate('/transactions')}>
			<TransactionForm
				onSuccess={(t) => navigate(`/transactions/${t.id}`)}
				onCancel={() => navigate('/transactions')}
			/>
		</FormPage>
	)
}
