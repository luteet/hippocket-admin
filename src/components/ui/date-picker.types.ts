export interface DatePickerProps {
	value: string
	onChange: (value: string) => void
	placeholder?: string
	container?: HTMLElement | null
	align?: 'start' | 'center' | 'end'
	/** Optional controlled open state (e.g. coordinated by FiltersPopover). */
	open?: boolean
	onOpenChange?: (open: boolean) => void
}
