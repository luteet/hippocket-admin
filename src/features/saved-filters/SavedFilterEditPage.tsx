import { useNavigate, useParams } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { useSavedFilter } from './hooks'
import { SavedFilterForm } from './SavedFilterForm'

export function SavedFilterEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: filter, isLoading } = useSavedFilter(id)

	return (
		<FormPage
			title="Edit saved filter"
			onBack={() => navigate(`/saved-filters/${id}`)}
			isLoading={isLoading}
			ready={Boolean(filter)}
			notFound={
				<p className="text-muted-foreground">Saved filter not found</p>
			}
		>
			<SavedFilterForm
				filter={filter}
				onSuccess={(f) => navigate(`/saved-filters/${f.id}`)}
				onCancel={() => navigate(`/saved-filters/${id}`)}
			/>
		</FormPage>
	)
}
