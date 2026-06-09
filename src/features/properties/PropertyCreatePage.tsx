import { useNavigate } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { PropertyForm } from './PropertyForm'

export function PropertyCreatePage() {
	const navigate = useNavigate()

	return (
		<FormPage title="New property" onBack={() => navigate('/properties')}>
			<PropertyForm
				onSuccess={(p) => navigate(`/properties/${p.id}`)}
				onCancel={() => navigate('/properties')}
			/>
		</FormPage>
	)
}
