import { Field } from '@/components/Field'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

// A labeled select for the export settings page (a plain Select wrapped in a
// Field — unlike FilterSelect, it isn't bound to the filters-popover context).
export function ExportSelect({
	label,
	value,
	onChange,
	options,
	placeholder,
}: {
	label: string
	value: string
	onChange: (value: string) => void
	options: { value: string; label: string }[]
	placeholder?: string
}) {
	return (
		<Field label={label}>
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger className="w-full">
					<SelectValue placeholder={placeholder ?? label} />
				</SelectTrigger>
				<SelectContent>
					{options.map((o) => (
						<SelectItem key={o.value} value={o.value}>
							{o.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</Field>
	)
}
