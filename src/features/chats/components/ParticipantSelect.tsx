import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

/**
 * Picks the author of a chat message — one of the chat's two participants.
 * The options are derived from the selected chat, so the picker is disabled
 * until a chat is chosen.
 */
export function ParticipantSelect({
	value,
	options,
	disabled,
	onChange,
}: {
	value?: string
	options: { id: string; email: string }[]
	disabled?: boolean
	onChange: (value: string) => void
}) {
	return (
		<Select
			value={value || undefined}
			onValueChange={onChange}
			disabled={disabled}
		>
			<SelectTrigger>
				<SelectValue
					placeholder={
						disabled
							? 'Select a chat first'
							: 'Select a participant'
					}
				/>
			</SelectTrigger>
			<SelectContent>
				{options.map((p) => (
					<SelectItem key={p.id} value={p.id}>
						{p.email}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
