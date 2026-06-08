import { AgentSelect } from '@/components/AgentSelect'
import { FormLayout } from '@/components/form/FormLayout'
import type { FormFieldEntry } from '@/components/form/types'
import type { Chat } from '@/types/api'
import { useChatForm } from './useChatForm'

interface Props {
	chat?: Chat | null
	onSuccess: (chat: Chat) => void
	onCancel: () => void
}

export function ChatForm({ chat, onSuccess, onCancel }: Props) {
	const { form, agentRefs, agentsLoading, isPending, onSubmit } = useChatForm(
		{
			chat,
			onSuccess,
		},
	)

	const fields: FormFieldEntry[] = [
		{
			type: 'custom',
			label: 'Participant 1',
			name: 'user_a',
			render: (
				<AgentSelect
					value={form.watch('user_a')}
					options={agentRefs}
					loading={agentsLoading}
					onChange={(v) => form.setValue('user_a', v)}
				/>
			),
		},
		{
			type: 'custom',
			label: 'Participant 2',
			name: 'user_b',
			render: (
				<AgentSelect
					value={form.watch('user_b')}
					options={agentRefs}
					loading={agentsLoading}
					onChange={(v) => form.setValue('user_b', v)}
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
		/>
	)
}
