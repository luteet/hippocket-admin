import type { ReactNode } from 'react'

import { Icon } from '@/components/Icon'
import { cn } from '@/lib/utils'
import type { SortOrder } from '@/types/api'

interface SortableHeaderProps {
	/** The column's header content (usually its label string). */
	label: ReactNode
	/** The whitelisted `sort_by` key this column sends to the API. */
	sortKey: string
	/** The column currently sorted on, if any. */
	sortBy?: string
	/** The active sort direction. */
	order?: SortOrder
	/** Cycle this column's sort (asc → desc → off). */
	onToggle: (key: string) => void
}

/**
 * A clickable column header that drives server-side sorting. Shows an up/down
 * chevron when its column is the active sort, and a faint neutral chevron
 * otherwise to signal the column is sortable.
 */
export function SortableHeader({
	label,
	sortKey,
	sortBy,
	order,
	onToggle,
}: SortableHeaderProps) {
	const active = sortBy === sortKey
	const icon = active
		? order === 'asc'
			? 'chevron-up'
			: 'chevron-down'
		: 'chevrons-up-down'

	return (
		<button
			type="button"
			onClick={() => onToggle(sortKey)}
			className={cn(
				'-mx-1 inline-flex items-center gap-1 rounded px-1 select-none uppercase transition-colors hover:text-foreground',
				active && 'text-foreground',
			)}
		>
			<span>{label}</span>
			<Icon
				name={icon}
				className={cn(
					'size-3.5 shrink-0',
					active ? 'text-primary' : 'text-muted-foreground/50',
				)}
			/>
		</button>
	)
}
