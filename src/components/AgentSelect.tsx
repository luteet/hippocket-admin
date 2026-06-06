import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import type { AgentRefOption } from '@/types/api'

export function AgentSelect({
	value,
	options,
	loading,
	onChange,
}: {
	value?: string
	options: AgentRefOption[]
	loading?: boolean
	onChange: (value: string) => void
}) {
	return (
		<Select value={value || undefined} onValueChange={onChange}>
			<SelectTrigger>
				<SelectValue
					placeholder={
						loading ? 'Loading agents…' : 'Select an agent'
					}
				/>
			</SelectTrigger>
			<SelectContent>
				{options.map((o) => (
					<SelectItem key={o.id} value={o.id}>
						{o.name ? `${o.name} (${o.email})` : o.email}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
