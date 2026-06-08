import { FormLayout } from '@/components/form/FormLayout'
import type { FormFieldEntry } from '@/components/form/types'
import type { Status } from '@/types/api'
import { useStatusForm } from './useStatusForm'

interface Props {
	status?: Status | null
	onSuccess: (status: Status) => void
	onCancel: () => void
}

export function StatusForm({ status, onSuccess, onCancel }: Props) {
	const { form, isPending, onSubmit } = useStatusForm({ status, onSuccess })

	const fields: FormFieldEntry[] = [
		{ type: 'text', name: 'name', label: 'Name', placeholder: 'On Hold' },
		{ type: 'text', name: 'label', label: 'Label', placeholder: 'on_hold' },
		{
			type: 'number',
			name: 'priority',
			label: 'Priority',
			placeholder: '25',
		},
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
