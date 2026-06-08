import { useNavigate } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { GroupFormPriceForm } from './GroupFormPriceForm'

export function GroupFormPriceCreatePage() {
	const navigate = useNavigate()
	const back = () => navigate('/group-form-prices')

	return (
		<FormPage title="New form price" onBack={back}>
			<GroupFormPriceForm
				onSuccess={back}
				onCancel={back}
				onDeleted={back}
			/>
		</FormPage>
	)
}
