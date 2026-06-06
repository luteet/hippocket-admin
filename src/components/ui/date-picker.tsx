import { useState } from 'react'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const MONTHS_SHORT = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
]

function formatDisplay(value: string) {
	const [y, m, d] = value.split('-').map(Number)
	if (!y || !m || !d) return value
	return `${MONTHS_SHORT[m - 1]} ${d}, ${y}`
}

// A date field: a button showing the picked date that opens a calendar popover.
// Value is a `YYYY-MM-DD` string (empty = unset). `container` nests the popover
// inside another layer (see PopoverContent) to avoid outside-click conflicts.
export function DatePicker({
	value,
	onChange,
	placeholder = 'Pick a date',
	container,
	align = 'start',
}: {
	value: string
	onChange: (value: string) => void
	placeholder?: string
	container?: HTMLElement | null
	align?: 'start' | 'center' | 'end'
}) {
	const [open, setOpen] = useState(false)
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
