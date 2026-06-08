import { useNavigate, useParams } from 'react-router'

import { SectionTitle } from '@/components/SectionTitle'
import { FormPage } from '@/components/form/FormPage'
import { useFormConfig } from '../hooks'
import { FormConfigForm } from './FormConfigForm'
import { RelatedGroupPrices } from './components/RelatedGroupPrices'

export function FormConfigEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: item, isLoading } = useFormConfig(id)
	const back = () => navigate('/form-configs')

	return (
		<FormPage
			title="Edit form"
			onBack={back}
			isLoading={isLoading}
			ready={Boolean(item)}
		>
			<div className="space-y-6">
				<FormConfigForm
					item={item}
					onSuccess={back}
					onCancel={back}
					onDeleted={back}
				/>
				<div>
					<SectionTitle>Group prices</SectionTitle>
					<div className="pt-4">
						<RelatedGroupPrices prices={item?.group_prices ?? []} />
					</div>
				</div>
			</div>
		</FormPage>
	)
}
