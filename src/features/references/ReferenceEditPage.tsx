import { useNavigate, useParams } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { useCatalogItem } from './hooks'
import { ReferenceForm } from './ReferenceForm'
import { REFERENCE_CONFIG, type ReferenceKind } from './useReferenceListPage'

export function ReferenceEditPage({ kind }: { kind: ReferenceKind }) {
	const { id } = useParams()
	const navigate = useNavigate()
	const config = REFERENCE_CONFIG[kind]
	const { data: item, isLoading } = useCatalogItem(
		config.queryKey,
		config.endpoint,
		id,
	)

	return (
		<FormPage
			title={`Edit ${config.singular.toLowerCase()}`}
			onBack={() => navigate(`/${kind}/${id}`)}
			isLoading={isLoading}
			ready={Boolean(item)}
			notFound={
				<p className="text-muted-foreground">
					{config.singular} not found
				</p>
			}
		>
			<ReferenceForm
				kind={kind}
				item={item}
				onSuccess={(saved) => navigate(`/${kind}/${saved.id}`)}
				onCancel={() => navigate(`/${kind}/${id}`)}
			/>
		</FormPage>
	)
}
