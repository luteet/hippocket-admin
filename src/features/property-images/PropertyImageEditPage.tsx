import { useNavigate, useParams } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { usePropertyImage } from './hooks'
import { PropertyImageForm } from './PropertyImageForm'

export function PropertyImageEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: image, isLoading } = usePropertyImage(id)

	return (
		<FormPage
			title="Edit image"
			onBack={() => navigate(`/property-images/${id}`)}
			isLoading={isLoading}
			ready={Boolean(image)}
		>
			{image && (
				<PropertyImageForm
					image={image}
					onSuccess={(img) => navigate(`/property-images/${img.id}`)}
					onCancel={() => navigate(`/property-images/${id}`)}
				/>
			)}
		</FormPage>
	)
}
