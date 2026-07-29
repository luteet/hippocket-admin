import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useFilterContainer } from '@/components/list/FilterContainerContext'
import type { RefOption } from '@/types/api'

/**
 * A multi-select dropdown for reference options with string IDs (UUID), used
 * inside FiltersPopover. The dropdown is portalled into the popover body via
 * FilterContainerContext.
 */
export function RefMultiSelect({
	options,
	selected,
	onToggle,
	placeholder = 'Select…',
	container: containerProp,
}: {
	options: RefOption[]
	selected: string[]
	onToggle: (id: string) => void
	placeholder?: string
	/** Portal container for the dropdown (e.g. a popover body). Falls back to
	 * the FiltersPopover context when omitted, then to document.body. */
	container?: HTMLElement | null
}) {
	const ctxContainer = useFilterContainer()
	const container = containerProp ?? ctxContainer
	const label = selected.length
		? options
				.filter((o) => selected.includes(o.id))
				.map((o) => o.name)
				.join(', ')
		: placeholder

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					variant="outline-2"
					className="w-full justify-between text-sm font-normal"
				>
					<span
						className={
							selected.length
								? 'truncate'
								: 'truncate text-muted-foreground'
						}
					>
						{label}
					</span>
					<Icon name="chevron-down" className="size-4 opacity-50" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				container={container}
				className="max-h-64 w-(--radix-dropdown-menu-trigger-width) overflow-y-auto"
			>
				{options.length === 0 ? (
					<div className="px-2 py-1.5 text-sm text-muted-foreground">
						No options
					</div>
				) : (
					options.map((o) => {
						const checked = selected.includes(o.id)
						return (
							<DropdownMenuItem
								key={o.id}
								onSelect={(e) => {
									e.preventDefault()
									onToggle(o.id)
								}}
							>
								<span className="flex size-4 items-center justify-center">
									{checked && <Icon name="check" />}
								</span>
								{o.name}
							</DropdownMenuItem>
						)
					})
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
