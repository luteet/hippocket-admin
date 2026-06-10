import type { FormFieldOption } from '@/components/form/types'

export interface ComboboxProps {
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
