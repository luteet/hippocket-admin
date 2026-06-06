import { useState } from 'react'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Monday-first weekday headers.
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
]

const pad = (n: number) => String(n).padStart(2, '0')
// Build/parse `YYYY-MM-DD` directly (no Date round-trip) to avoid timezone drift.
const toISO = (y: number, m: number, d: number) =>
	`${y}-${pad(m + 1)}-${pad(d)}`

function parseISO(value?: string) {
	if (!value) return null
	const [y, m, d] = value.split('-').map(Number)
	if (!y || !m || !d) return null
	return { y, m: m - 1, d }
}

// A minimal month-grid calendar driving a `YYYY-MM-DD` string value.
export function Calendar({
	value,
	onSelect,
}: {
	value?: string
	onSelect: (value: string) => void
}) {
	const today = new Date()
	const selected = parseISO(value)
	const [view, setView] = useState(() =>
		selected
			? { y: selected.y, m: selected.m }
			: { y: today.getFullYear(), m: today.getMonth() },
	)

	const startOffset = (new Date(view.y, view.m, 1).getDay() + 6) % 7
	const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
	const todayISO = toISO(
		today.getFullYear(),
		today.getMonth(),
		today.getDate(),
	)

	const cells: (number | null)[] = [
		...Array.from({ length: startOffset }, () => null),
		...Array.from({ length: daysInMonth }, (_, i) => i + 1),
	]

	const shiftMonth = (delta: number) =>
		setView(({ y, m }) => {
			const next = m + delta
			return { y: y + Math.floor(next / 12), m: ((next % 12) + 12) % 12 }
		})

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
				<span className="text-sm font-medium">
					{MONTHS[view.m]} {view.y}
				</span>
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
				{cells.map((d, i) => {
					if (d === null) return <div key={`pad-${i}`} />
					const iso = toISO(view.y, view.m, d)
					const isSelected = iso === value
					const isToday = iso === todayISO
					return (
						<button
							key={iso}
							type="button"
							onClick={() => onSelect(iso)}
							className={cn(
								'flex size-8 items-center justify-center rounded-md text-sm transition-colors hover:bg-muted',
								isToday &&
									!isSelected &&
									'font-medium text-primary',
								isSelected &&
									'bg-primary text-primary-foreground hover:bg-primary',
							)}
						>
							{d}
						</button>
					)
				})}
			</div>
		</div>
	)
}
