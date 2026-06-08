import { AgentSelect } from '@/components/AgentSelect'
import { FormLayout } from '@/components/form/FormLayout'
import type { FormFieldEntry } from '@/components/form/types'
import type { AiSession } from '@/types/api'
import { useSessionForm } from './useSessionForm'

interface Props {
	onSuccess: (session: AiSession) => void
	onCancel: () => void
}

export function SessionForm({ onSuccess, onCancel }: Props) {
	const { form, agentOptions, agentsLoading, isPending, onSubmit } =
		useSessionForm({ onSuccess })

	const fields: FormFieldEntry[] = [
		{
			type: 'custom',
			label: 'Agent',
			name: 'user_id',
			render: (
				<AgentSelect
					value={form.watch('user_id')}
					options={agentOptions}
					loading={agentsLoading}
					onChange={(v) => form.setValue('user_id', v)}
				/>
			),
		},
	]

	return (
		<FormLayout
			form={form}
			fields={fields}
			onSubmit={onSubmit}
			onCancel={onCancel}
			isPending={isPending}
			submitLabel="Create"
		/>
	)
}
