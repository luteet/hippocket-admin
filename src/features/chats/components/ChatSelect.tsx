import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import type { Chat } from '@/types/api'

/**
 * Picks a chat. Used both as a required field in the message form and — with
 * `allOption` — as the "All chats" filter on the messages list.
 */
export function ChatSelect({
	value,
	options,
	loading,
	onChange,
	allOption,
	container,
}: {
	value?: string
	options: Chat[]
	loading?: boolean
	onChange: (value: string) => void
	allOption?: { value: string; label: string }
	// Portal target for the dropdown — pass the filters popover body when used
	// as a list filter so opening it doesn't dismiss the popover.
	container?: HTMLElement | null
}) {
	return (
		<Select value={value || undefined} onValueChange={onChange}>
			<SelectTrigger>
				<SelectValue
					placeholder={loading ? 'Loading chats…' : 'Select a chat'}
				/>
			</SelectTrigger>
			<SelectContent container={container}>
				{allOption && (
					<SelectItem value={allOption.value}>
						{allOption.label}
					</SelectItem>
				)}
				{options.map((c) => (
					<SelectItem key={c.id} value={c.id}>
						{c.user_list}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
