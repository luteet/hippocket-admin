import { FormLayout } from '@/components/form/FormLayout'
import type { FormFieldEntry } from '@/components/form/types'
import type { LinkName } from '@/types/api'
import { useLinkNameForm } from './useLinkNameForm'

interface Props {
	item?: LinkName | null
	onSuccess: () => void
	onCancel: () => void
	onDeleted: () => void
}

export function LinkNameForm({ item, onSuccess, onCancel, onDeleted }: Props) {
	const { isEdit, form, onSubmit, isPending, isDeleting, handleDelete } =
		useLinkNameForm({ item, onSuccess, onDeleted })

	const fields: FormFieldEntry[] = [
		{ type: 'text', name: 'name', label: 'Name' },
		{
			type: 'url',
			name: 'link',
			label: 'Link',
			placeholder: 'https://example.com',
		},
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
			deleteTitle="Delete link?"
			deleteDescription="This link will be permanently deleted."
		/>
	)
}
