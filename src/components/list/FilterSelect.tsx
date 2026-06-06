import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	useFilterContainer,
	useFilterOpenField,
} from './FilterContainerContext'

// A labeled select for use inside FiltersPopover. Renders `allOption` first (the
// "All …" reset choice) when given, then `options`. The dropdown is portalled
// into the popover body via the FilterContainer context.
export function FilterSelect({
	label,
	value,
	onChange,
	options,
	allOption,
	placeholder,
}: {
	label: string
	value: string
	onChange: (value: string) => void
	options: { value: string; label: string }[]
	allOption?: { value: string; label: string }
	placeholder?: string
}) {
	const container = useFilterContainer()
	const { open, onOpenChange } = useFilterOpenField()
	return (
		<div className="space-y-1.5">
			<Label>{label}</Label>
			<Select
				value={value}
				onValueChange={onChange}
				open={open}
				onOpenChange={onOpenChange}
			>
				<SelectTrigger className="w-full">
					<SelectValue placeholder={placeholder ?? label} />
				</SelectTrigger>
				<SelectContent container={container}>
					{allOption && (
						<SelectItem value={allOption.value}>
							{allOption.label}
						</SelectItem>
					)}
					{options.map((o) => (
						<SelectItem key={o.value} value={o.value}>
							{o.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
