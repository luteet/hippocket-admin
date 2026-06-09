import { useEffect, useMemo, useState, type ReactNode } from 'react'

import { Icon } from '@/components/Icon'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import {
	FilterContainerContext,
	FilterOpenContext,
} from './FilterContainerContext'

// A list page's filters, collapsed into a popover so the toolbar stays compact.
// The trigger shows a badge with the number of active filters; "Clear all"
// resets them. Filter fields go in as `children` (use FilterSelect / FilterDate,
// or any field that reads the container via `useFilterContainer()`); the popover
// body element is provided through context so their dropdowns portal inside it.
export function FiltersPopover({
	activeCount,
	onClear,
	children,
	align = 'end',
}: {
	activeCount: number
	onClear: () => void
	children: ReactNode
	align?: 'start' | 'center' | 'end'
}) {
	const [open, setOpen] = useState(false)
	// On mobile, anchor the popover to the left edge instead of the trigger's
	// (right-side) end, so it opens into the screen rather than hugging the edge.
	const isMobile = useMediaQuery('(max-width: 767.98px)')
	const [filtersEl, setFiltersEl] = useState<HTMLDivElement | null>(null)
	const [triggerEl, setTriggerEl] = useState<HTMLButtonElement | null>(null)
	// Id of the filter field whose dropdown is currently open, so only one is
	// open at a time (see FilterOpenContext). Reset when the popover closes.
	const [openId, setOpenId] = useState<string | null>(null)

	const handleOpenChange = (next: boolean) => {
		setOpen(next)
		if (!next) setOpenId(null)
	}

	// Close on a pointer-down outside the popover body and its trigger. We do it
	// manually (Radix's outside-close is turned off below) because an open Select
	// is modal and confuses Radix's detection.
	useEffect(() => {
		if (!open) return
		const handlePointerDown = (e: PointerEvent) => {
			const target = e.target as Node | null
			if (!target) return
			if (filtersEl?.contains(target) || triggerEl?.contains(target))
				return
			setOpen(false)
			setOpenId(null)
		}
		document.addEventListener('pointerdown', handlePointerDown)
		return () =>
			document.removeEventListener('pointerdown', handlePointerDown)
	}, [open, filtersEl, triggerEl])

	const openCoord = useMemo(() => ({ openId, setOpenId }), [openId])

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<PopoverTrigger asChild>
				<Button
					ref={setTriggerEl}
					variant="outline-2"
					className="gap-2 font-normal"
				>
					<Icon name="filter" className="size-4" />
					Filters
					{activeCount > 0 && (
						<span className="ml-0.5 inline-flex size-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
							{activeCount}
						</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				ref={setFiltersEl}
				align={isMobile ? 'start' : align}
				// Keep some breathing room from the viewport edges so the popover
				// isn't flush against the screen on narrow/mobile widths.
				collisionPadding={12}
				// pointer-events-auto: stay interactive while an open Select sets
				// pointer-events:none on <body>.
				className="w-[calc(100vw-1.5rem)] md:w-80 pointer-events-auto"
				onInteractOutside={(e) => e.preventDefault()}
			>
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-sm font-semibold">Filters</span>
						<Button
							variant="ghost"
							size="sm"
							className="h-auto px-2 py-1 text-xs"
							disabled={activeCount === 0}
							onClick={onClear}
						>
							Clear all
						</Button>
					</div>

					<FilterContainerContext value={filtersEl}>
						<FilterOpenContext value={openCoord}>
							{children}
						</FilterOpenContext>
					</FilterContainerContext>
				</div>
			</PopoverContent>
		</Popover>
	)
}
