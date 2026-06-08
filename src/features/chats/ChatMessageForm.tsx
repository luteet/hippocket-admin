import { FormLayout } from '@/components/form/FormLayout'
import type { FormFieldEntry } from '@/components/form/types'
import type { ChatMessage } from '@/types/api'
import { useChatMessageForm } from './useChatMessageForm'
import { ChatSelect } from './components/ChatSelect'
import { ParticipantSelect } from './components/ParticipantSelect'

interface Props {
	message?: ChatMessage | null
	/** Pre-select a chat when creating (e.g. from a chat's Messages tab). */
	initialChatId?: string
	onSuccess: (message: ChatMessage) => void
	onCancel: () => void
}

export function ChatMessageForm({
	message,
	initialChatId,
	onSuccess,
	onCancel,
}: Props) {
	const {
		isEdit,
		form,
		chatId,
		setChatId,
		participants,
		chatRefs,
		chatsLoading,
		isPending,
		onSubmit,
	} = useChatMessageForm({ message, initialChatId, onSuccess })

	const fields: FormFieldEntry[] = [
		{
			type: 'custom',
			label: 'Chat',
			name: 'chat_id',
			render: isEdit ? (
				<p className="text-sm text-muted-foreground">
					{message?.chat_id.slice(0, 8)}
				</p>
			) : (
				<ChatSelect
					value={chatId}
					options={chatRefs}
					loading={chatsLoading}
					onChange={setChatId}
				/>
			),
		},
		{
			type: 'custom',
			label: 'Author',
			name: 'user_id',
			render: isEdit ? (
				<p className="text-sm text-muted-foreground">
					{message?.user_email}
				</p>
			) : (
				<ParticipantSelect
					value={form.watch('user_id')}
					options={participants}
					disabled={!chatId}
					onChange={(v) => form.setValue('user_id', v)}
				/>
			),
		},
		{ type: 'textarea', name: 'text', label: 'Text', rows: 5 },
		{ type: 'switch', name: 'is_read', label: 'Read' },
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
