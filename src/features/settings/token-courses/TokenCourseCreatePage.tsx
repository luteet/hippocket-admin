import { useNavigate } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { TokenCourseForm } from './TokenCourseForm'

export function TokenCourseCreatePage() {
	const navigate = useNavigate()
	const back = () => navigate('/token-courses')

	return (
		<FormPage title="New token course" onBack={back}>
			<TokenCourseForm
				onSuccess={back}
				onCancel={back}
				onDeleted={back}
			/>
		</FormPage>
	)
}
