import { FormLayout } from '@/components/form/FormLayout'
import type { FormFieldEntry } from '@/components/form/types'
import type { CashOffersEmail } from '@/types/api'
import {
	ALL_PROPERTIES,
	useCashOffersEmailForm,
} from './useCashOffersEmailForm'

interface Props {
	email?: CashOffersEmail | null
	onSuccess: (email: CashOffersEmail) => void
	onCancel: () => void
}

export function CashOffersEmailForm({ email, onSuccess, onCancel }: Props) {
	const { form, groupOptions, isPending, onSubmit } = useCashOffersEmailForm({
		email,
		onSuccess,
	})

	const fields: FormFieldEntry[] = [
		{ type: 'text', name: 'name', label: 'Name' },
		{ type: 'email', name: 'email', label: 'Email' },
		{
			type: 'select',
			name: 'group_id',
			label: 'Group',
			searchable: true,
			searchPlaceholder: 'Search groups…',
			options: [
				{ value: ALL_PROPERTIES, label: 'All properties' },
				...groupOptions.map((g) => ({
					value: String(g.id),
					label: g.name,
				})),
			],
		},
		{ type: 'switch', name: 'is_active', label: 'Active' },
	]

	return (
		<FormLayout
			form={form}
			fields={fields}
			onSubmit={onSubmit}
			onCancel={onCancel}
			isPending={isPending}
		/>
	)
}
