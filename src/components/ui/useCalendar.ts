import { useState } from 'react'

import { MONTHS, YEARS_PER_PAGE } from '@/components/ui/calendar.constants'
import { parseISO, toISO } from '@/components/ui/calendar.utils'

export interface CalendarCell {
	day: number
	iso: string
	isSelected: boolean
	isToday: boolean
}

export interface MonthCell {
	month: number
	label: string
	isSelected: boolean
	isCurrent: boolean
}

export interface YearCell {
	year: number
	isSelected: boolean
	isCurrent: boolean
}

// Which sub-view the calendar is showing: the day grid, the month grid, or the
// year grid. The header label drills down (days → months → years) and a
// selection drills back up.
export type CalendarView = 'days' | 'months' | 'years'

interface UseCalendarParams {
	value?: string
	onSelect: (value: string) => void
}

export function useCalendar({ value, onSelect }: UseCalendarParams) {
	const today = new Date()
	const selected = parseISO(value)
	const [view, setView] = useState(() =>
		selected
			? { y: selected.y, m: selected.m }
			: { y: today.getFullYear(), m: today.getMonth() },
	)
	const [mode, setMode] = useState<CalendarView>('days')

	const startOffset = (new Date(view.y, view.m, 1).getDay() + 6) % 7
	const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
	const todayISO = toISO(
		today.getFullYear(),
		today.getMonth(),
		today.getDate(),
	)

	// `null` entries are leading blanks before the 1st; the rest are day cells.
	const cells: (CalendarCell | null)[] = [
		...Array.from({ length: startOffset }, () => null),
		...Array.from({ length: daysInMonth }, (_, i) => {
			const day = i + 1
			const iso = toISO(view.y, view.m, day)
			return {
				day,
				iso,
				isSelected: iso === value,
				isToday: iso === todayISO,
			}
		}),
	]

	const months: MonthCell[] = MONTHS.map((label, month) => ({
		month,
		label,
		isSelected: selected?.y === view.y && selected?.m === month,
		isCurrent:
			today.getFullYear() === view.y && today.getMonth() === month,
	}))

	// The year grid shows a fixed window of `YEARS_PER_PAGE` years containing
	// the current view year.
	const yearStart = view.y - (view.y % YEARS_PER_PAGE)
	const years: YearCell[] = Array.from(
		{ length: YEARS_PER_PAGE },
		(_, i) => {
			const year = yearStart + i
			return {
				year,
				isSelected: selected?.y === year,
				isCurrent: today.getFullYear() === year,
			}
		},
	)

	// The header chevrons step by month / year / year-page depending on mode.
	const shift = (delta: number) => {
		if (mode === 'days')
			setView(({ y, m }) => {
				const next = m + delta
				return {
					y: y + Math.floor(next / 12),
					m: ((next % 12) + 12) % 12,
				}
			})
		else if (mode === 'months')
			setView((v) => ({ ...v, y: v.y + delta }))
		else setView((v) => ({ ...v, y: v.y + delta * YEARS_PER_PAGE }))
	}

	const selectMonth = (month: number) => {
		setView((v) => ({ ...v, m: month }))
		setMode('days')
	}

	const selectYear = (year: number) => {
		setView((v) => ({ ...v, y: year }))
		setMode('months')
	}

	const headerLabel =
		mode === 'years'
			? `${years[0].year} – ${years[years.length - 1].year}`
			: mode === 'months'
				? `${view.y}`
				: `${MONTHS[view.m]} ${view.y}`

	// Header click drills one level down; the deepest level is a no-op toggle.
	const drillDown = () =>
		setMode((m) =>
			m === 'days' ? 'months' : m === 'months' ? 'years' : 'years',
		)

	return {
		mode,
		headerLabel,
		cells,
		months,
		years,
		shift,
		drillDown,
		selectMonth,
		selectYear,
		onSelect,
	}
}
