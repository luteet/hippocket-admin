import { Input } from '@/components/ui/input'
import { AgentSelect } from '@/components/AgentSelect'
import { FormLayout } from '@/components/form/FormLayout'
import type { FormFieldEntry } from '@/components/form/types'
import type { SavedFilter } from '@/types/api'
import { useSavedFilterForm } from './useSavedFilterForm'

interface Props {
	filter?: SavedFilter | null
	onSuccess: (filter: SavedFilter) => void
	onCancel: () => void
}

export function SavedFilterForm({ filter, onSuccess, onCancel }: Props) {
	const { isEdit, form, isPending, onSubmit, agentOptions, isLoadingAgents } =
		useSavedFilterForm({ filter, onSuccess })

	const fields: FormFieldEntry[] = [
		{
			type: 'custom',
			label: 'Agent',
			name: 'user_id',
			render: isEdit ? (
				// A saved filter can't be reassigned — show the agent read-only.
				<Input value={filter?.user_email ?? ''} disabled />
			) : (
				<AgentSelect
					value={form.watch('user_id')}
					options={agentOptions}
					loading={isLoadingAgents}
					onChange={(v) =>
						form.setValue('user_id', v, { shouldValidate: true })
					}
				/>
			),
		},
		{
			type: 'text',
			name: 'title',
			label: 'Title',
			placeholder: 'My filter',
		},
		{
			type: 'textarea',
			name: 'value',
			label: 'Value',
			placeholder: 'beds-min=2&cities=Plano',
			rows: 3,
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
