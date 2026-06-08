import { useEffect, useMemo, useRef, useState } from 'react'

import { Icon } from '@/components/Icon'
import { Input } from '@/components/ui/input'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import type { FormFieldOption } from '@/components/form/types'
import { cn } from '@/lib/utils'

interface ComboboxProps {
	value?: string
	onValueChange: (value: string) => void
	options: FormFieldOption[]
	placeholder?: string
	searchPlaceholder?: string
	emptyText?: string
	disabled?: boolean
}

/**
 * A single-select dropdown with a search field, for option lists too long to
 * scan in a plain {@link Select}. Visually matches the Select (reuses its
 * `.select-*` classes) but renders its own list so it can be filtered. Driven
 * by a `value`/`onValueChange` pair like Select, so it drops into the form
 * renderer's `Controller`.
 */
export function Combobox({
	value,
	onValueChange,
	options,
	placeholder = 'Select…',
	searchPlaceholder = 'Search…',
	emptyText = 'No results',
	disabled,
}: ComboboxProps) {
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState('')
	const [active, setActive] = useState(0)
	const listRef = useRef<HTMLDivElement>(null)

	const selected = options.find((o) => o.value === value)

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase()
		if (!q) return options
		return options.filter((o) => o.label.toLowerCase().includes(q))
	}, [options, query])

	// Scroll the highlighted row into view while arrow-keying through a long
	// list. (The filter resets the highlight in the input's change handler.)
	useEffect(() => {
		if (!open) return
		listRef.current
			?.querySelector('[data-active="true"]')
			?.scrollIntoView({ block: 'nearest' })
	}, [active, open])

	function choose(next: string) {
		onValueChange(next)
		setOpen(false)
		setQuery('')
	}

	function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'ArrowDown') {
			e.preventDefault()
			setActive((i) => Math.min(i + 1, filtered.length - 1))
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			setActive((i) => Math.max(i - 1, 0))
		} else if (e.key === 'Enter') {
			e.preventDefault()
			const o = filtered[active]
			if (o) choose(o.value)
		}
	}

	return (
		<Popover
			open={open}
			onOpenChange={(next) => {
				setOpen(next)
				if (!next) setQuery('')
			}}
		>
			<PopoverTrigger asChild>
				<button
					type="button"
					disabled={disabled}
					className="select-trigger"
					data-placeholder={selected ? undefined : ''}
				>
					<span>{selected ? selected.label : placeholder}</span>
					<Icon name="chevron-down" className="select-trigger-icon" />
				</button>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				className="w-(--radix-popover-trigger-width) overflow-hidden p-0"
			>
				<div className="border-b border-border p-2">
					<Input
						autoFocus
						value={query}
						onChange={(e) => {
							setQuery(e.target.value)
							setActive(0)
						}}
						onKeyDown={onInputKeyDown}
						placeholder={searchPlaceholder}
					/>
				</div>
				<div ref={listRef} className="max-h-60 overflow-y-auto p-1">
					{filtered.length === 0 ? (
						<div className="px-2 py-1.5 text-sm text-muted-foreground">
							{emptyText}
						</div>
					) : (
						filtered.map((o, i) => (
							<button
								key={o.value}
								type="button"
								data-active={i === active}
								onClick={() => choose(o.value)}
								onMouseMove={() => setActive(i)}
								className={cn(
									'select-item hover:bg-muted',
									i === active && 'bg-muted',
								)}
							>
								<span className="select-item-indicator">
									{o.value === value && (
										<Icon name="check" className="size-4" />
									)}
								</span>
								{o.label}
							</button>
						))
					)}
				</div>
			</PopoverContent>
		</Popover>
	)
}
