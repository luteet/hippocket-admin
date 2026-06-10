import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import type { DatePickerProps } from '@/components/ui/date-picker.types'
import { formatDisplay } from '@/components/ui/date-picker.utils'
import { useDatePicker } from '@/components/ui/useDatePicker'
import { cn } from '@/lib/utils'

export type { DatePickerProps }

// A date field: a button showing the picked date that opens a calendar popover.
// Value is a `YYYY-MM-DD` string (empty = unset). `container` nests the popover
// inside another layer (see PopoverContent) to avoid outside-click conflicts.
export function DatePicker({
	value,
	onChange,
	placeholder = 'Pick a date',
	container,
	align = 'start',
	open: openProp,
	onOpenChange,
}: DatePickerProps) {
	const { open, setOpen } = useDatePicker({ open: openProp, onOpenChange })

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline-2"
					className={cn(
						'w-full justify-start gap-2 font-normal',
						!value && 'text-muted-foreground',
					)}
				>
					<Icon
						name="calendar"
						className="size-4 text-muted-foreground"
					/>
					{value ? formatDisplay(value) : placeholder}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				container={container}
				align={align}
				className="w-auto p-3"
			>
				<Calendar
					value={value}
					onSelect={(v) => {
						onChange(v)
						setOpen(false)
					}}
				/>
				{value && (
					<Button
						variant="ghost"
						size="sm"
						className="mt-2 h-auto w-full px-2 py-1 text-xs"
						onClick={() => {
							onChange('')
							setOpen(false)
						}}
					>
						Clear
					</Button>
				)}
			</PopoverContent>
		</Popover>
	)
}
