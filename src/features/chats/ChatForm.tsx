import { Icon } from '@/components/Icon'
import { AgentSelect } from '@/components/AgentSelect'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/Field'
import type { Chat } from '@/types/api'
import { useChatForm } from './useChatForm'

interface Props {
	chat?: Chat | null
	onSuccess: (chat: Chat) => void
	onCancel: () => void
}

export function ChatForm({ chat, onSuccess, onCancel }: Props) {
	const {
		errors,
		userA,
		setUserA,
		userB,
		setUserB,
		agentRefs,
		agentsLoading,
		isPending,
		onSubmit,
	} = useChatForm({ chat, onSuccess })

	return (
		<form onSubmit={onSubmit} className="space-y-6">
			<Field label="Participant 1" error={errors.user_a?.message}>
				<AgentSelect
					value={userA}
					options={agentRefs}
					loading={agentsLoading}
					onChange={setUserA}
				/>
			</Field>

			<Field label="Participant 2" error={errors.user_b?.message}>
				<AgentSelect
					value={userB}
					options={agentRefs}
					loading={agentsLoading}
					onChange={setUserB}
				/>
			</Field>

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
