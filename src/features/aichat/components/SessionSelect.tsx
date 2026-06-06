import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import type { AiSession } from '@/types/api'

/**
 * Picks an AI chat session. Used both as a required field in the message form
 * and — with `allOption` — as the "All sessions" filter on the messages list.
 */
export function SessionSelect({
	value,
	options,
	loading,
	onChange,
	allOption,
	container,
}: {
	value?: string
	options: AiSession[]
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
					placeholder={
						loading ? 'Loading sessions…' : 'Select a session'
					}
				/>
			</SelectTrigger>
			<SelectContent container={container}>
				{allOption && (
					<SelectItem value={allOption.value}>
						{allOption.label}
					</SelectItem>
				)}
				{options.map((s) => (
					<SelectItem key={s.id} value={s.id}>
						{s.user_email} · {s.id.slice(0, 8)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
