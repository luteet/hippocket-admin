import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import type { RefOption } from '@/types/api'

/** Picks the partner to pin to a shared list. */
export function PartnerSelect({
	value,
	options,
	loading,
	disabled,
	onChange,
}: {
	value?: string
	options: RefOption[]
	loading?: boolean
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
						loading ? 'Loading partners…' : 'Select a partner'
					}
				/>
			</SelectTrigger>
			<SelectContent>
				{options.map((o) => (
					<SelectItem key={o.id} value={o.id}>
						{o.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
