import { useNavigate } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { SavedFilterForm } from './SavedFilterForm'

export function SavedFilterCreatePage() {
	const navigate = useNavigate()

	return (
		<FormPage
			title="New saved filter"
			onBack={() => navigate('/saved-filters')}
		>
			<SavedFilterForm
				onSuccess={(f) => navigate(`/saved-filters/${f.id}`)}
				onCancel={() => navigate('/saved-filters')}
			/>
		</FormPage>
	)
}
