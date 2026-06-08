import { useNavigate } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { FormConfigForm } from './FormConfigForm'

export function FormConfigCreatePage() {
	const navigate = useNavigate()
	const back = () => navigate('/form-configs')

	return (
		<FormPage title="New form" onBack={back}>
			<FormConfigForm onSuccess={back} onCancel={back} onDeleted={back} />
		</FormPage>
	)
}
