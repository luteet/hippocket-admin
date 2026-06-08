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
	/**
	 * Server-side search. When provided, the query is sent here (debounced)
	 * instead of filtering `options` locally — `options` are treated as the
	 * already-filtered results. Use for lists too large to load in full.
	 */
	onSearch?: (query: string) => void
	/** Show a loading row (server-search results are in flight). */
	loading?: boolean
	/**
	 * Label to display for the current `value` when it isn't present in
	 * `options` (e.g. the saved selection before a server search returns it).
	 */
	selectedLabel?: string
	/** Load the next page when the user scrolls near the bottom of the list. */
	onLoadMore?: () => void
	/** Another page is available to load. */
	hasMore?: boolean
	/** The next page is currently loading. */
	loadingMore?: boolean
}

// Distance (px) from the bottom of the list at which the next page is fetched.
const LOAD_MORE_THRESHOLD = 48

const SEARCH_DEBOUNCE = 250

/**
 * A single-select dropdown with a search field, for option lists too long to
 * scan in a plain {@link Select}. Visually matches the Select (reuses its
 * `.select-*` classes) but renders its own list so it can be filtered. Driven
 * by a `value`/`onValueChange` pair like Select, so it drops into the form
 * renderer's `Controller`.
 *
 * Filters client-side by default; pass `onSearch` to search server-side for
 * lists too large to load in full.
 */
export function Combobox({
	value,
	onValueChange,
	options,
	placeholder = 'Select…',
	searchPlaceholder = 'Search…',
	emptyText = 'No results',
	disabled,
	onSearch,
	loading,
	selectedLabel,
	onLoadMore,
	hasMore,
	loadingMore,
}: ComboboxProps) {
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState('')
	const [active, setActive] = useState(0)
	const listRef = useRef<HTMLDivElement>(null)

	const selected = options.find((o) => o.value === value)
	// Fall back to the caller-supplied label (then the raw value) so the trigger
	// still names the current selection even when it isn't in `options`.
	const displayLabel =
		selected?.label ?? (value ? (selectedLabel ?? value) : '')

	const filtered = useMemo(() => {
		// Server-side mode: trust the caller's already-filtered options.
		if (onSearch) return options
		const q = query.trim().toLowerCase()
		if (!q) return options
		return options.filter((o) => o.label.toLowerCase().includes(q))
	}, [options, query, onSearch])

	// Server-side mode: push the (debounced) query to the caller while open.
	useEffect(() => {
		if (!onSearch || !open) return
		const t = setTimeout(() => onSearch(query), SEARCH_DEBOUNCE)
		return () => clearTimeout(t)
	}, [query, open, onSearch])

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

	function onListScroll(e: React.UIEvent<HTMLDivElement>) {
		if (!onLoadMore || !hasMore || loadingMore) return
		const el = e.currentTarget
		const distanceToBottom =
			el.scrollHeight - el.scrollTop - el.clientHeight
		if (distanceToBottom < LOAD_MORE_THRESHOLD) onLoadMore()
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
					data-placeholder={displayLabel ? undefined : ''}
				>
					<span>{displayLabel || placeholder}</span>
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
				<div
					ref={listRef}
					onScroll={onListScroll}
					className="max-h-60 overflow-y-auto p-1"
				>
					{loading && filtered.length === 0 ? (
						<div className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground">
							<Icon
								name="loader"
								className="size-4 animate-spin"
							/>
							Searching…
						</div>
					) : filtered.length === 0 ? (
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
					{loadingMore && filtered.length > 0 && (
						<div className="flex items-center justify-center gap-2 px-2 py-2 text-sm text-muted-foreground">
							<Icon
								name="loader"
								className="size-4 animate-spin"
							/>
							Loading more…
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	)
}
