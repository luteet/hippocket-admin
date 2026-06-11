import { Icon } from '@/components/Icon'

export interface ActiveFilter {
	/** URL param key, e.g. 'status'. Used to clear the filter. */
	key: string
	/** Human label, e.g. 'Status'. */
	label: string
	/** Display value, e.g. 'Closed'. */
	value: string
}

// A removable-chip summary of the active filters, shown beneath the toolbar so
// the user sees *what* is filtered without opening the popover. Each chip clears
// its own filter on click; "Clear all" (only when more than one) wipes them.
// Renders nothing when no filters are active, so there's no empty layout gap.
export function FilterChips({
	filters,
	onRemove,
	onClearAll,
}: {
	filters: ActiveFilter[]
	onRemove: (key: string) => void
	onClearAll?: () => void
}) {
	if (filters.length === 0) return null
	return (
		<div className="mb-4 flex flex-wrap items-center gap-2">
			{filters.map((f) => (
				<button
					key={f.key}
					type="button"
					onClick={() => onRemove(f.key)}
					className="filter-chip"
					aria-label={`Remove filter ${f.label}: ${f.value}`}
				>
					<span className="filter-chip__label">{f.label}:</span>
					<span>{f.value}</span>
					<Icon name="x" className="size-3" />
				</button>
			))}
			{onClearAll && filters.length > 1 && (
				<button
					type="button"
					onClick={onClearAll}
					className="filter-chip filter-chip--clear"
				>
					Clear all
				</button>
			)}
		</div>
	)
}
