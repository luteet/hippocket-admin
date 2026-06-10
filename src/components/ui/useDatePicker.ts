import { useState } from 'react'

import type { DatePickerProps } from '@/components/ui/date-picker.types'

export function useDatePicker({
	open: openProp,
	onOpenChange,
}: Pick<DatePickerProps, 'open' | 'onOpenChange'>) {
	const [openState, setOpenState] = useState(false)
	const open = openProp ?? openState
	const setOpen = (next: boolean) => {
		onOpenChange?.(next)
		if (openProp === undefined) setOpenState(next)
	}
	return { open, setOpen }
}
