import { useNavigate, useParams } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { useGroupFormPrice } from '../hooks'
import { GroupFormPriceForm } from './GroupFormPriceForm'

export function GroupFormPriceEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: item, isLoading } = useGroupFormPrice(id)
	const back = () => navigate('/group-form-prices')

	return (
		<FormPage
			title="Edit form price"
			onBack={back}
			isLoading={isLoading}
			ready={Boolean(item)}
		>
			<GroupFormPriceForm
				item={item}
				onSuccess={back}
				onCancel={back}
				onDeleted={back}
			/>
		</FormPage>
	)
}
