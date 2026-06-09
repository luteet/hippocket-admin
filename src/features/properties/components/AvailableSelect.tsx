import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/** Multi-select for a property's `available` audiences (e.g. agent, buyer). */
export function AvailableSelect({
	options,
	selected,
	onToggle,
}: {
	options: { value: string; label: string }[]
	selected: string[]
	onToggle: (value: string) => void
}) {
	const label = selected.length
		? options
				.filter((o) => selected.includes(o.value))
				.map((o) => o.label)
				.join(', ')
		: 'Select availability'

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					variant="outline-2"
					className="w-full justify-between text-base font-normal"
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
			<DropdownMenuContent className="max-h-64 w-(--radix-dropdown-menu-trigger-width) overflow-y-auto">
				{options.map((o) => {
					const checked = selected.includes(o.value)
					return (
						<DropdownMenuItem
							key={o.value}
							onSelect={(e) => {
								e.preventDefault()
								onToggle(o.value)
							}}
						>
							<span className="flex size-4 items-center justify-center">
								{checked && <Icon name="check" />}
							</span>
							{o.label}
						</DropdownMenuItem>
					)
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
