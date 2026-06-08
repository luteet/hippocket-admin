import { FormLayout } from '@/components/form/FormLayout'
import type { FormFieldEntry } from '@/components/form/types'
import type { AiMessage } from '@/types/api'
import { useMessageForm } from './useMessageForm'
import { ROLE_OPTIONS } from './useMessagesPage'
import { SessionSelect } from './components/SessionSelect'

interface Props {
	message?: AiMessage | null
	onSuccess: (message: AiMessage) => void
	onCancel: () => void
}

export function MessageForm({ message, onSuccess, onCancel }: Props) {
	const { isEdit, form, sessionRefs, sessionsLoading, isPending, onSubmit } =
		useMessageForm({ message, onSuccess })

	const fields: FormFieldEntry[] = [
		{
			type: 'custom',
			label: 'Session',
			name: 'session_id',
			render: isEdit ? (
				<p className="text-sm text-muted-foreground">
					{message?.session_user_email} ·{' '}
					{message?.session_id.slice(0, 8)}
				</p>
			) : (
				<SessionSelect
					value={form.watch('session_id')}
					options={sessionRefs}
					loading={sessionsLoading}
					onChange={(v) => form.setValue('session_id', v)}
				/>
			),
		},
		{
			type: 'select',
			name: 'role',
			label: 'Role',
			options: ROLE_OPTIONS.map((o) => ({
				value: o.value,
				label: o.label,
			})),
		},
		{ type: 'textarea', name: 'content', label: 'Content', rows: 5 },
		{ type: 'switch', name: 'is_visible', label: 'Visible' },
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
