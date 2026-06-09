import { useCallback, useMemo, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'

import type { IconName } from '@/components/Icon'
import { NAV_COMMANDS, scoreCommand } from './commands'
import { matchingScopes, type EntityScope } from './scopes'
import { useScopeResults } from './useScopeResults'

// One selectable row in the palette. `index` is its position across all
// sections (for keyboard selection); `trailing` picks the right-hand hint chip.
export interface PaletteItem {
	id: string
	index: number
	icon: IconName
	title: string
	subtitle?: string
	// Breadcrumb prefix before the title (the parent nav group).
	prefix?: string
	// 'scope' → diving into a nested entity search; 'enter' → navigates.
	trailing: 'scope' | 'enter'
	onSelect: () => void
}

export interface PaletteSection {
	id: string
	label: string
	items: PaletteItem[]
}

// Cap on how many nav matches to show so the list stays scannable.
const NAV_RESULT_LIMIT = 6

export function useCommandPalette(open: boolean, onClose: () => void) {
	const navigate = useNavigate()
	const [query, setQuery] = useState('')
	const [scope, setScope] = useState<EntityScope | null>(null)
	const [selected, setSelected] = useState(0)

	// Reset to a clean slate each time the palette opens — the "adjust state
	// during render" pattern (no effect), so the exit animation can keep the
	// previous content while closing instead of being wiped by a remount.
	const [prevOpen, setPrevOpen] = useState(open)
	if (open !== prevOpen) {
		setPrevOpen(open)
		if (open) {
			setQuery('')
			setScope(null)
			setSelected(0)
		}
	}

	const go = useCallback(
		(to: string) => {
			navigate(to)
			onClose()
		},
		[navigate, onClose],
	)

	const enterScope = useCallback((s: EntityScope) => {
		setScope(s)
		setQuery('')
		setSelected(0)
	}, [])

	const exitScope = useCallback(() => {
		setScope(null)
		setQuery('')
		setSelected(0)
	}, [])

	// Live entity results — only fetched while a scope is active.
	const {
		results,
		isLoading: resultsLoading,
		hasQuery: resultsHasQuery,
	} = useScopeResults(scope, query)

	// Build the visible sections, assigning each item a running global index.
	const { sections, flat } = useMemo(() => {
		const built: PaletteSection[] = []

		if (scope) {
			// Scoped mode: only live entity results.
			built.push({
				id: scope.key,
				label: scope.label,
				items: results.map((r) => ({
					id: `${scope.key}-${r.id}`,
					index: 0,
					icon: scope.icon,
					title: r.title,
					subtitle: r.subtitle,
					trailing: 'enter' as const,
					onSelect: () => go(r.to),
				})),
			})
		} else {
			const q = query.trim()

			// "Search <Entity>" shortcuts the query hints at.
			const scopeItems: PaletteItem[] = matchingScopes(q).map((s) => ({
				id: `scope-${s.key}`,
				index: 0,
				icon: s.icon,
				title: `Search ${s.label}`,
				subtitle: `Find a specific ${s.singular} by name or email`,
				trailing: 'scope' as const,
				onSelect: () => enterScope(s),
			}))
			if (scopeItems.length) {
				built.push({ id: 'search', label: 'Search', items: scopeItems })
			}

			// Nav matches (all of them when the query is empty).
			const navCommands = q
				? NAV_COMMANDS.map((c) => ({
						c,
						score: scoreCommand(c, q) ?? -1,
					}))
						.filter((x) => x.score >= 0)
						.sort((a, b) => b.score - a.score)
						.slice(0, NAV_RESULT_LIMIT)
						.map((x) => x.c)
				: NAV_COMMANDS

			built.push({
				id: 'nav',
				label: 'Navigation',
				items: navCommands.map((c) => ({
					id: `nav-${c.to}-${c.label}`,
					index: 0,
					icon: c.icon,
					title: c.label,
					subtitle: c.description,
					prefix: c.parentLabel,
					trailing: 'enter' as const,
					onSelect: () => go(c.to),
				})),
			})
		}

		// Drop empty sections, then number the surviving items sequentially.
		const nonEmpty = built.filter((s) => s.items.length > 0)
		let i = 0
		const indexed = nonEmpty.map((s) => ({
			...s,
			items: s.items.map((it) => ({ ...it, index: i++ })),
		}))
		return { sections: indexed, flat: indexed.flatMap((s) => s.items) }
	}, [scope, results, query, go, enterScope])

	// Reset the highlight to the first row whenever the typed query changes —
	// the React-sanctioned "adjust state during render" pattern (no effect).
	const [prevQuery, setPrevQuery] = useState(query)
	if (query !== prevQuery) {
		setPrevQuery(query)
		setSelected(0)
	}

	// Keep the highlight in range as the list shrinks (e.g. async agent results
	// resolving) without storing a derived value.
	const activeIndex =
		flat.length === 0 ? 0 : Math.min(selected, flat.length - 1)

	const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'ArrowDown') {
			e.preventDefault()
			setSelected((i) => (flat.length ? (i + 1) % flat.length : 0))
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			setSelected((i) =>
				flat.length ? (i - 1 + flat.length) % flat.length : 0,
			)
		} else if (e.key === 'Enter') {
			e.preventDefault()
			flat[activeIndex]?.onSelect()
		} else if (e.key === 'Backspace' && query === '' && scope) {
			// Empty input + Backspace backs out of the entity scope.
			e.preventDefault()
			exitScope()
		}
	}

	// Escape exits the scope first (if any); only a scope-less Escape closes the
	// dialog. Returned for Radix's `onEscapeKeyDown`.
	const onEscapeKeyDown = (e: Event) => {
		if (scope) {
			e.preventDefault()
			exitScope()
		}
	}

	const placeholder = scope
		? `Search ${scope.label.toLowerCase()} by name or email…`
		: 'Search menu, pages and records…'

	return {
		query,
		setQuery,
		scope,
		exitScope,
		sections,
		selected: activeIndex,
		setSelected,
		onInputKeyDown,
		onEscapeKeyDown,
		placeholder,
		resultsLoading,
		resultsHasQuery,
		isEmpty: flat.length === 0,
	}
}
