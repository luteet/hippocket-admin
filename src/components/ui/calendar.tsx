import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { WEEKDAYS } from '@/components/ui/calendar.constants'
import { useCalendar } from '@/components/ui/useCalendar'
import { cn } from '@/lib/utils'

// A minimal month-grid calendar driving a `YYYY-MM-DD` string value.
export function Calendar({
	value,
	onSelect,
}: {
	value?: string
	onSelect: (value: string) => void
}) {
	const { monthLabel, cells, shiftMonth } = useCalendar({ value, onSelect })

	return (
		<div className="w-64">
			<div className="mb-2 flex items-center justify-between">
				<Button
					variant="ghost"
					size="icon"
					className="size-7"
					onClick={() => shiftMonth(-1)}
					aria-label="Previous month"
				>
					<Icon name="chevron-left" className="size-4" />
				</Button>
				<span className="text-sm font-medium">{monthLabel}</span>
				<Button
					variant="ghost"
					size="icon"
					className="size-7"
					onClick={() => shiftMonth(1)}
					aria-label="Next month"
				>
					<Icon name="chevron-right" className="size-4" />
				</Button>
			</div>

			<div className="grid grid-cols-7 gap-0.5">
				{WEEKDAYS.map((w) => (
					<div
						key={w}
						className="py-1 text-center text-xs text-muted-foreground"
					>
						{w}
					</div>
				))}
				{cells.map((cell, i) => {
					if (cell === null) return <div key={`pad-${i}`} />
					return (
						<button
							key={cell.iso}
							type="button"
							onClick={() => onSelect(cell.iso)}
							className={cn(
								'flex size-8 items-center justify-center rounded-md text-sm transition-colors hover:bg-muted',
								cell.isToday &&
									!cell.isSelected &&
									'font-medium text-primary',
								cell.isSelected &&
									'bg-primary text-primary-foreground hover:bg-primary',
							)}
						>
							{cell.day}
						</button>
					)
				})}
			</div>
		</div>
	)
}
