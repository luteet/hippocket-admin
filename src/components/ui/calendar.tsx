import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { WEEKDAYS } from '@/components/ui/calendar.constants'
import { useCalendar } from '@/components/ui/useCalendar'
import { cn } from '@/lib/utils'

// A minimal calendar driving a `YYYY-MM-DD` string value. The header label
// drills down from the day grid into month- and year-picker grids.
export function Calendar({
	value,
	min,
	max,
	onSelect,
}: {
	value?: string
	min?: string
	max?: string
	onSelect: (value: string) => void
}) {
	const {
		mode,
		headerLabel,
		cells,
		months,
		years,
		shift,
		drillDown,
		selectMonth,
		selectYear,
	} = useCalendar({ value, min, max, onSelect })

	return (
		<div className="w-64">
			<div className="mb-2 flex items-center justify-between">
				<Button
					variant="ghost"
					size="icon"
					className="size-7"
					onClick={() => shift(-1)}
					aria-label="Previous"
				>
					<Icon name="chevron-left" className="size-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className="h-7 px-2 text-sm font-medium"
					onClick={drillDown}
				>
					{headerLabel}
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="size-7"
					onClick={() => shift(1)}
					aria-label="Next"
				>
					<Icon name="chevron-right" className="size-4" />
				</Button>
			</div>

			{mode === 'days' && (
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
								disabled={cell.isDisabled}
								onClick={() => onSelect(cell.iso)}
								className={cn(
									'flex size-8 items-center justify-center rounded-md text-sm transition-colors hover:bg-muted',
									cell.isToday &&
										!cell.isSelected &&
										'font-medium text-primary',
									cell.isSelected &&
										'bg-primary text-primary-foreground hover:bg-primary',
									cell.isDisabled &&
										'pointer-events-none text-muted-foreground/40',
								)}
							>
								{cell.day}
							</button>
						)
					})}
				</div>
			)}

			{mode === 'months' && (
				<div className="grid grid-cols-3 gap-1">
					{months.map((cell) => (
						<button
							key={cell.month}
							type="button"
							disabled={cell.isDisabled}
							onClick={() => selectMonth(cell.month)}
							className={cn(
								'flex h-9 items-center justify-center rounded-md text-sm transition-colors hover:bg-muted',
								cell.isCurrent &&
									!cell.isSelected &&
									'font-medium text-primary',
								cell.isSelected &&
									'bg-primary text-primary-foreground hover:bg-primary',
								cell.isDisabled &&
									'pointer-events-none text-muted-foreground/40',
							)}
						>
							{cell.label.slice(0, 3)}
						</button>
					))}
				</div>
			)}

			{mode === 'years' && (
				<div className="grid grid-cols-3 gap-1">
					{years.map((cell) => (
						<button
							key={cell.year}
							type="button"
							disabled={cell.isDisabled}
							onClick={() => selectYear(cell.year)}
							className={cn(
								'flex h-9 items-center justify-center rounded-md text-sm transition-colors hover:bg-muted',
								cell.isCurrent &&
									!cell.isSelected &&
									'font-medium text-primary',
								cell.isSelected &&
									'bg-primary text-primary-foreground hover:bg-primary',
								cell.isDisabled &&
									'pointer-events-none text-muted-foreground/40',
							)}
						>
							{cell.year}
						</button>
					))}
				</div>
			)}
		</div>
	)
}
