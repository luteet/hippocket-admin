import { useEffect, useState } from 'react'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Label } from '@/components/ui/label'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useLogsContext } from '../LogsContext'
import { formatLogLabel } from '../format'
import { ALL } from '../useLogsPage'

// The audit-log filters, collapsed into a popover so the toolbar stays compact.
// The trigger button shows a count of active filters; "Clear" resets them all.
// State comes from the LogsContext rather than props.
export function LogsFilters() {
	const {
		showEventFilter,
		activeFilterCount,
		clearFilters,
		event,
		setEvent,
		sendStatus,
		setSendStatus,
		createdFrom,
		setCreatedFrom,
		createdTo,
		setCreatedTo,
		events,
		sendStatuses,
	} = useLogsContext()

	const [open, setOpen] = useState(false)
	const [filtersEl, setFiltersEl] = useState<HTMLDivElement | null>(null)
	const [triggerEl, setTriggerEl] = useState<HTMLButtonElement | null>(null)

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
		}
		document.addEventListener('pointerdown', handlePointerDown)
		return () =>
			document.removeEventListener('pointerdown', handlePointerDown)
	}, [open, filtersEl, triggerEl])

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					ref={setTriggerEl}
					variant="outline-2"
					className="gap-2"
				>
					<Icon name="filter" className="size-4" />
					Filters
					{activeFilterCount > 0 && (
						<span className="ml-0.5 inline-flex size-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
							{activeFilterCount}
						</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				ref={setFiltersEl}
				align="end"
				// pointer-events-auto: stay interactive while an open Select sets
				// pointer-events:none on <body>.
				className="w-80 pointer-events-auto"
				onInteractOutside={(e) => e.preventDefault()}
			>
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-sm font-semibold">Filters</span>
						<Button
							variant="ghost"
							size="sm"
							className="h-auto px-2 py-1 text-xs"
							disabled={activeFilterCount === 0}
							onClick={clearFilters}
						>
							Clear all
						</Button>
					</div>

					{showEventFilter && (
						<div className="space-y-1.5">
							<Label>Event</Label>
							<Select value={event} onValueChange={setEvent}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Event" />
								</SelectTrigger>
								<SelectContent container={filtersEl}>
									<SelectItem value={ALL}>
										All events
									</SelectItem>
									{events.map((e) => (
										<SelectItem key={e} value={e}>
											{formatLogLabel(e)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}

					<div className="space-y-1.5">
						<Label>Send status</Label>
						<Select
							value={sendStatus}
							onValueChange={setSendStatus}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Send status" />
							</SelectTrigger>
							<SelectContent container={filtersEl}>
								<SelectItem value={ALL}>
									All statuses
								</SelectItem>
								{sendStatuses.map((s) => (
									<SelectItem key={s} value={s}>
										{formatLogLabel(s)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1.5">
							<Label>From</Label>
							<DatePicker
								value={createdFrom}
								onChange={setCreatedFrom}
								container={filtersEl}
								placeholder="From"
							/>
						</div>
						<div className="space-y-1.5">
							<Label>To</Label>
							<DatePicker
								value={createdTo}
								onChange={setCreatedTo}
								container={filtersEl}
								placeholder="To"
							/>
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	)
}
