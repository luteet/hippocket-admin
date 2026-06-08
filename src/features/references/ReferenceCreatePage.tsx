import { useNavigate } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { ReferenceForm } from './ReferenceForm'
import { REFERENCE_CONFIG, type ReferenceKind } from './useReferenceListPage'

export function ReferenceCreatePage({ kind }: { kind: ReferenceKind }) {
	const navigate = useNavigate()
	const config = REFERENCE_CONFIG[kind]

	return (
		<FormPage
			title={`New ${config.singular.toLowerCase()}`}
			onBack={() => navigate(`/${kind}`)}
		>
			<ReferenceForm
				kind={kind}
				onSuccess={(item) => navigate(`/${kind}/${item.id}`)}
				onCancel={() => navigate(`/${kind}`)}
			/>
		</FormPage>
	)
}
