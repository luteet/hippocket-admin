import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { FormLayout } from '@/components/form/FormLayout'
import type { FormFieldEntry } from '@/components/form/types'
import type { GroupFormPrice } from '@/types/api'
import { useGroupFormPriceForm } from './useGroupFormPriceForm'

interface Props {
	item?: GroupFormPrice | null
	onSuccess: () => void
	onCancel: () => void
	onDeleted: () => void
}

export function GroupFormPriceForm({
	item,
	onSuccess,
	onCancel,
	onDeleted,
}: Props) {
	const {
		isEdit,
		form,
		formOptions,
		groupOptions,
		onSubmit,
		isPending,
		isDeleting,
		handleDelete,
	} = useGroupFormPriceForm({ item, onSuccess, onDeleted })

	const groupId = form.watch('group_id')

	const fields: FormFieldEntry[] = [
		{ type: 'text', name: 'name', label: 'Name' },
		{
			type: 'select',
			name: 'form_config_id',
			label: 'Form',
			placeholder: 'Select a form',
			options: formOptions.map((o) => ({ value: o.id, label: o.name })),
		},
		{
			// group_id is numeric — the shadcn Select works with strings, so it
			// can't go through the declarative `select` (which keeps strings).
			type: 'custom',
			label: 'Group',
			name: 'group_id',
			render: (
				<Select
					value={groupId ? String(groupId) : undefined}
					onValueChange={(v) => form.setValue('group_id', Number(v))}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select a group" />
					</SelectTrigger>
					<SelectContent>
						{groupOptions.map((o) => (
							<SelectItem key={o.id} value={String(o.id)}>
								{o.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			),
		},
		{ type: 'number', name: 'price', label: 'Price', step: '0.01' },
		{ type: 'textarea', name: 'comment', label: 'Comment' },
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
			deleteTitle="Delete form price?"
			deleteDescription="This group form price will be permanently deleted."
		/>
	)
}
