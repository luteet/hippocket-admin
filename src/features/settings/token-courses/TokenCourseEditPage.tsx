import { useNavigate, useParams } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { useTokenCourse } from '../hooks'
import { TokenCourseForm } from './TokenCourseForm'

export function TokenCourseEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: item, isLoading } = useTokenCourse(id)
	const back = () => navigate('/token-courses')

	return (
		<FormPage
			title="Edit token course"
			onBack={back}
			isLoading={isLoading}
			ready={Boolean(item)}
		>
			<TokenCourseForm
				item={item}
				onSuccess={back}
				onCancel={back}
				onDeleted={back}
			/>
		</FormPage>
	)
}
