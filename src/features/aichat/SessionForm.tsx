import { Icon } from '@/components/Icon'
import { AgentSelect } from '@/components/AgentSelect'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/Field'
import type { AiSession } from '@/types/api'
import { useSessionForm } from './useSessionForm'

interface Props {
	onSuccess: (session: AiSession) => void
	onCancel: () => void
}

export function SessionForm({ onSuccess, onCancel }: Props) {
	const {
		errors,
		userId,
		setUserId,
		agentOptions,
		agentsLoading,
		isPending,
		onSubmit,
	} = useSessionForm({ onSuccess })

	return (
		<form onSubmit={onSubmit} className="space-y-6">
			<Field label="Agent" error={errors.user_id?.message}>
				<AgentSelect
					value={userId}
					options={agentOptions}
					loading={agentsLoading}
					onChange={setUserId}
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
					Create
				</Button>
			</div>
		</form>
	)
}
