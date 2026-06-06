import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Field } from '@/components/Field'
import { SwitchField } from '@/components/SwitchField'
import type { AiMessage } from '@/types/api'
import { useMessageForm, type MessageFormValues } from './useMessageForm'
import { ROLE_OPTIONS } from './useMessagesPage'
import { SessionSelect } from './components/SessionSelect'

interface Props {
	message?: AiMessage | null
	onSuccess: (message: AiMessage) => void
	onCancel: () => void
}

export function MessageForm({ message, onSuccess, onCancel }: Props) {
	const {
		isEdit,
		register,
		errors,
		setValue,
		sessionId,
		setSessionId,
		role,
		isVisible,
		sessionRefs,
		sessionsLoading,
		isPending,
		onSubmit,
	} = useMessageForm({ message, onSuccess })

	return (
		<form onSubmit={onSubmit} className="space-y-6">
			<Field label="Session" error={errors.session_id?.message}>
				{isEdit ? (
					<p className="text-sm text-muted-foreground">
						{message?.session_user_email} ·{' '}
						{message?.session_id.slice(0, 8)}
					</p>
				) : (
					<SessionSelect
						value={sessionId}
						options={sessionRefs}
						loading={sessionsLoading}
						onChange={setSessionId}
					/>
				)}
			</Field>

			<Field label="Role">
				<Select
					value={role}
					onValueChange={(v) =>
						setValue('role', v as MessageFormValues['role'])
					}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{ROLE_OPTIONS.map((o) => (
							<SelectItem key={o.value} value={o.value}>
								{o.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</Field>

			<Field label="Content" error={errors.content?.message}>
				<Textarea rows={5} {...register('content')} />
			</Field>

			<SwitchField
				id="is_visible"
				label="Visible"
				checked={isVisible}
				onCheckedChange={(v) => setValue('is_visible', v)}
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
