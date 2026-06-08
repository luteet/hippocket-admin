import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Field } from '@/components/Field'
import { SwitchField } from '@/components/SwitchField'
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
		register,
		errors,
		setValue,
		chatId,
		setChatId,
		userId,
		setUserId,
		isRead,
		participants,
		chatRefs,
		chatsLoading,
		isPending,
		onSubmit,
	} = useChatMessageForm({ message, initialChatId, onSuccess })

	return (
		<form onSubmit={onSubmit} className="space-y-6">
			<Field label="Chat" error={errors.chat_id?.message}>
				{isEdit ? (
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
				)}
			</Field>

			<Field label="Author" error={errors.user_id?.message}>
				{isEdit ? (
					<p className="text-sm text-muted-foreground">
						{message?.user_email}
					</p>
				) : (
					<ParticipantSelect
						value={userId}
						options={participants}
						disabled={!chatId}
						onChange={setUserId}
					/>
				)}
			</Field>

			<Field label="Text" error={errors.text?.message}>
				<Textarea rows={5} {...register('text')} />
			</Field>

			<SwitchField
				id="is_read"
				label="Read"
				checked={isRead}
				onCheckedChange={(v) => setValue('is_read', v)}
			/>

			<div className="flex justify-end gap-2 pt-4">
				<Button
					type="button"
					variant="outline"
					className="flex-auto xs:min-w-32 xs:flex-none"
					onClick={onCancel}
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={isPending}
					className="flex-auto xs:min-w-32 xs:flex-none"
				>
					{isPending && (
						<Icon name="loader" className="animate-spin" />
					)}
					Save
				</Button>
			</div>
		</form>
	)
}
