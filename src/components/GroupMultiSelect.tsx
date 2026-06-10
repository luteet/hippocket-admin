import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { GroupOption } from '@/types/api'

export function GroupMultiSelect({
	options,
	selected,
	onToggle,
}: {
	options: GroupOption[]
	selected: number[]
	onToggle: (id: number) => void
}) {
	const label = selected.length
		? options
			.filter((o) => selected.includes(o.id))
			.map((o) => o.name)
			.join(', ')
		: 'Select groups'

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
			<DropdownMenuContent className="max-h-64 w-(--radix-dropdown-menu-trigger-width) overflow-y-auto">
				{options.length === 0 ? (
					<div className="px-2 py-1.5 text-sm text-muted-foreground">
						No groups
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
