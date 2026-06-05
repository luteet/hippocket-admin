import { useEffect, useMemo, useRef, useState } from 'react'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { AgentOption } from '@/types/api'

export function AdminMultiSelect({
	options,
	selected,
	onToggle,
}: {
	options: AgentOption[]
	selected: string[]
	onToggle: (id: string) => void
}) {
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState('')
	const searchRef = useRef<HTMLInputElement>(null)

	// Radix Menu auto-focuses the first item on open; move focus to the search
	// field instead so the user can type immediately.
	useEffect(() => {
		if (!open) return
		const id = requestAnimationFrame(() => searchRef.current?.focus())
		return () => cancelAnimationFrame(id)
	}, [open])

	const label = selected.length
		? options
				.filter((o) => selected.includes(o.id))
				.map((o) => o.email || o.name || o.id)
				.join(', ')
		: 'Select admins'

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase()
		if (!q) return options
		return options.filter((o) =>
			`${o.email} ${o.name} ${o.id}`.toLowerCase().includes(q),
		)
	}, [options, query])

	return (
		<DropdownMenu
			open={open}
			onOpenChange={(next) => {
				setOpen(next)
				if (!next) setQuery('')
			}}
		>
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
			<DropdownMenuContent className="max-h-72 w-(--radix-dropdown-menu-trigger-width) overflow-y-auto">
				<div className="sticky top-0 z-10 -mt-1 bg-popover p-1">
					<div className="relative">
						<Icon
							name="search"
							className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
						/>
						<Input
							ref={searchRef}
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							// Stop the menu's typeahead/navigation from stealing keystrokes.
							onKeyDown={(e) => e.stopPropagation()}
							placeholder="Search admins"
							className="h-8 pl-8 text-sm"
						/>
					</div>
				</div>
				{filtered.length === 0 ? (
					<div className="px-2 py-1.5 text-sm text-muted-foreground">
						{options.length === 0 ? 'No agents' : 'No matches'}
					</div>
				) : (
					filtered.map((o) => {
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
								{o.email || o.name || o.id}
							</DropdownMenuItem>
						)
					})
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
