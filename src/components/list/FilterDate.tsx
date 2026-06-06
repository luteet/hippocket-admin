import { DatePicker } from '@/components/ui/date-picker'
import { Label } from '@/components/ui/label'
import {
	useFilterContainer,
	useFilterOpenField,
} from './FilterContainerContext'

// A labeled date field (YYYY-MM-DD string) for use inside FiltersPopover. The
// calendar popover is nested into the filters popover body via the container
// context so it doesn't dismiss the parent on open.
export function FilterDate({
	label,
	value,
	onChange,
	placeholder,
}: {
	label: string
	value: string
	onChange: (value: string) => void
	placeholder?: string
}) {
	const container = useFilterContainer()
	const { open, onOpenChange } = useFilterOpenField()
	return (
		<div className="space-y-1.5">
			<Label>{label}</Label>
			<DatePicker
				value={value}
				onChange={onChange}
				container={container}
				placeholder={placeholder ?? label}
				open={open}
				onOpenChange={onOpenChange}
			/>
		</div>
	)
}
