import { FormLayout } from '@/components/form/FormLayout'
import type { FormFieldEntry } from '@/components/form/types'
import type { CatalogRecord } from '@/types/api'
import { useReferenceForm } from './useReferenceForm'
import type { ReferenceKind } from './useReferenceListPage'

interface Props {
	kind: ReferenceKind
	item?: CatalogRecord | null
	onSuccess: (item: CatalogRecord) => void
	onCancel: () => void
}

export function ReferenceForm({ kind, item, onSuccess, onCancel }: Props) {
	const { config, form, isPending, onSubmit } = useReferenceForm({
		kind,
		item,
		onSuccess,
	})

	const fields: FormFieldEntry[] = [
		{
			type: 'text',
			name: 'name',
			label: 'Name',
			placeholder: config.singular,
		},
		{
			type: 'textarea',
			name: 'description',
			label: 'Description',
			placeholder: 'What this category covers…',
			hidden: !config.hasContent,
		},
		{
			type: 'textarea',
			name: 'keywords',
			label: 'Keywords',
			placeholder: 'comma, separated, keywords',
			hidden: !config.hasContent,
		},
		{ type: 'number', name: 'sort', label: 'Sort', placeholder: '0' },
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
