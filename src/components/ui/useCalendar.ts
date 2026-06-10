import { useState } from 'react'

import { MONTHS } from '@/components/ui/calendar.constants'
import { parseISO, toISO } from '@/components/ui/calendar.utils'

export interface CalendarCell {
	day: number
	iso: string
	isSelected: boolean
	isToday: boolean
}

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

	const shiftMonth = (delta: number) =>
		setView(({ y, m }) => {
			const next = m + delta
			return { y: y + Math.floor(next / 12), m: ((next % 12) + 12) % 12 }
		})

	return {
		monthLabel: `${MONTHS[view.m]} ${view.y}`,
		cells,
		shiftMonth,
		onSelect,
	}
}
