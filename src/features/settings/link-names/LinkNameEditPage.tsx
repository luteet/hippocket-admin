import { useNavigate, useParams } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { useLinkName } from '../hooks'
import { LinkNameForm } from './LinkNameForm'

export function LinkNameEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: item, isLoading } = useLinkName(id)
	const back = () => navigate('/link-names')

	return (
		<FormPage
			title="Edit link"
			onBack={back}
			isLoading={isLoading}
			ready={Boolean(item)}
		>
			<LinkNameForm
				item={item}
				onSuccess={back}
				onCancel={back}
				onDeleted={back}
			/>
		</FormPage>
	)
}
