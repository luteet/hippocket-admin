import { useNavigate, useParams } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { useProperty } from './hooks'
import { PropertyForm } from './PropertyForm'

export function PropertyEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: property, isLoading } = useProperty(id)

	return (
		<FormPage
			title="Edit property"
			onBack={() => navigate(`/properties/${id}`)}
			isLoading={isLoading}
			ready={Boolean(property)}
		>
			<PropertyForm
				property={property}
				onSuccess={(p) => navigate(`/properties/${p.id}`)}
				onCancel={() => navigate(`/properties/${id}`)}
			/>
		</FormPage>
	)
}
