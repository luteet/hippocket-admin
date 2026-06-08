import { FormLayout } from '@/components/form/FormLayout'
import type { FormFieldEntry } from '@/components/form/types'
import type { FormConfig } from '@/types/api'
import { useFormConfigForm } from './useFormConfigForm'

interface Props {
	item?: FormConfig | null
	onSuccess: () => void
	onCancel: () => void
	onDeleted: () => void
}

export function FormConfigForm({
	item,
	onSuccess,
	onCancel,
	onDeleted,
}: Props) {
	const { isEdit, form, onSubmit, isPending, isDeleting, handleDelete } =
		useFormConfigForm({ item, onSuccess, onDeleted })

	const fields: FormFieldEntry[] = [
		{ type: 'text', name: 'name', label: 'Name' },
		{
			type: 'text',
			name: 'slug',
			label: 'Slug',
			disabled: isEdit,
			placeholder: 'make-an-offer',
		},
		{
			type: 'text',
			name: 'endpoint',
			label: 'Endpoint',
			placeholder: '/api/forms/...',
		},
		{
			type: 'grid',
			fields: [
				{
					type: 'number',
					name: 'price',
					label: 'Price',
					step: '0.01',
				},
				{ type: 'text', name: 'currency', label: 'Currency' },
			],
		},
		{ type: 'textarea', name: 'description', label: 'Description' },
		{ type: 'switch', name: 'is_active', label: 'Active' },
	]

	return (
		<FormLayout
			form={form}
			fields={fields}
			onSubmit={onSubmit}
			onCancel={onCancel}
			isPending={isPending}
			isEdit={isEdit}
			onDelete={handleDelete}
			isDeleting={isDeleting}
			deleteTitle="Delete form?"
			deleteDescription="This form configuration will be permanently deleted."
		/>
	)
}
