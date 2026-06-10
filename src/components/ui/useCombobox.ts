import { useEffect, useMemo, useRef, useState } from 'react'

import type { ComboboxProps } from '@/components/ui/combobox.types'

// Distance (px) from the bottom of the list at which the next page is fetched.
const LOAD_MORE_THRESHOLD = 48

const SEARCH_DEBOUNCE = 250

export function useCombobox({
	value,
	onValueChange,
	options,
	selectedLabel,
	onSearch,
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

	function onOpenChange(next: boolean) {
		setOpen(next)
		if (!next) setQuery('')
	}

	function onQueryChange(next: string) {
		setQuery(next)
		setActive(0)
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

	return {
		open,
		query,
		active,
		listRef,
		displayLabel,
		filtered,
		choose,
		setActive,
		onOpenChange,
		onQueryChange,
		onListScroll,
		onInputKeyDown,
	}
}
