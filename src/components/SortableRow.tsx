import type { ReactNode } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Icon } from '@/components/Icon'
import { TableCell, TableRow } from '@/components/ui/table'

interface SortableRowProps {
	/** Stable sortable id — the record's UUID (string) or int id. */
	id: string | number
	/** Disables dragging (e.g. a search/sort that isn't the natural order). */
	disabled?: boolean
	/** Whether the row navigates on click (adds the pointer cursor). */
	clickable?: boolean
	onMouseDown?: React.MouseEventHandler<HTMLTableRowElement>
	onClick?: React.MouseEventHandler<HTMLTableRowElement>
	/** The row's data cells (rendered by DataTable after the drag handle). */
	children: ReactNode
}

/**
 * A DataTable body row wrapped for drag-and-drop reordering: it carries a
 * leading drag-handle cell (only the handle starts a drag) followed by the
 * row's normal cells. Used by DataTable when a `reorder` prop is supplied; the
 * surrounding DndContext/SortableContext live in DataTable.
 */
export function SortableRow({
	id,
	disabled,
	clickable,
	onMouseDown,
	onClick,
	children,
}: SortableRowProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id, disabled })

	return (
		<TableRow
			ref={setNodeRef}
			style={{
				// Translate only (not Transform) so the row is moved without the
				// scaleX/scaleY dnd-kit adds to morph it into the hovered row's
				// size — that scaling visibly stretches the dragged row.
				transform: CSS.Translate.toString(transform),
				transition,
				// Lift the dragged row above its siblings while it moves.
				position: isDragging ? 'relative' : undefined,
				zIndex: isDragging ? 1 : undefined,
				opacity: isDragging ? 0.7 : undefined,
			}}
			onMouseDown={onMouseDown}
			onClick={onClick}
			className={clickable ? 'cursor-pointer' : undefined}
		>
			<TableCell className="w-10 pr-0">
				<button
					type="button"
					{...attributes}
					{...listeners}
					disabled={disabled}
					aria-label="Drag to reorder"
					// Keep the handle's press out of the row's click/navigation
					// detection (see DataTable's downPos logic).
					onClick={(e) => e.stopPropagation()}
					onMouseDown={(e) => e.stopPropagation()}
					className="flex touch-none items-center justify-center text-muted-foreground/50 transition-colors hover:text-foreground disabled:cursor-default disabled:opacity-30 disabled:hover:text-muted-foreground/50 not-disabled:cursor-grab not-disabled:active:cursor-grabbing"
				>
					<Icon name="grip-vertical" className="size-4" />
				</button>
			</TableCell>
			{children}
		</TableRow>
	)
}
