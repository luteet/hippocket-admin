import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { CanvasThumbnail } from '@/components/CanvasThumbnail'
import { Icon } from '@/components/Icon'
import { Tooltip } from '@/components/ui/tooltip'

interface SortableImageProps {
	id: string
	/** Resolved media URL, or null when the image has no source. */
	src: string | null
	/** Open the image's standalone detail page. */
	onOpen: () => void
}

/**
 * A draggable gallery tile for the property images grid: the tile itself opens
 * the image, while a small grip handle (top-left, shown on hover) starts the
 * drag so a plain click still navigates. The surrounding DndContext/
 * SortableContext live in PropertyImagesTab.
 */
export function SortableImage({ id, src, onOpen }: SortableImageProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id })

	return (
		<div
			ref={setNodeRef}
			style={{
				// Translate only (not Transform) so the tile is moved without the
				// scaleX/scaleY dnd-kit adds to morph it into the hovered tile's
				// size — that scaling visibly stretches the dragged image.
				transform: CSS.Translate.toString(transform),
				transition,
				zIndex: isDragging ? 1 : undefined,
				opacity: isDragging ? 0.7 : undefined,
			}}
			className="group relative"
		>
			<Tooltip content="Open image">
				<button
					type="button"
					onClick={onOpen}
					className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border border-border bg-muted text-muted-foreground transition-opacity hover:opacity-80"
				>
					{src ? (
						<CanvasThumbnail src={src} />
					) : (
						<Icon name="image" className="size-7" />
					)}
				</button>
			</Tooltip>
			<button
				type="button"
				{...attributes}
				{...listeners}
				aria-label="Drag to reorder"
				onClick={(e) => e.stopPropagation()}
				className="absolute left-1 top-1 flex size-7 cursor-grab touch-none items-center justify-center rounded-md border border-border bg-card/90 text-muted-foreground opacity-0 transition-opacity hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100 active:cursor-grabbing"
			>
				<Icon name="grip-vertical" className="size-4" />
			</button>
		</div>
	)
}
