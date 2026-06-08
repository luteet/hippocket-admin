import { useNavigate } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { LinkNameForm } from './LinkNameForm'

export function LinkNameCreatePage() {
	const navigate = useNavigate()
	const back = () => navigate('/link-names')

	return (
		<FormPage title="New link" onBack={back}>
			<LinkNameForm onSuccess={back} onCancel={back} onDeleted={back} />
		</FormPage>
	)
}
