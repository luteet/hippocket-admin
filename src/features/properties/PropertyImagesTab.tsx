import { DndContext, closestCenter } from '@dnd-kit/core'
import { restrictToParentElement } from '@dnd-kit/modifiers'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'

import { Card, CardContent } from '@/components/ui/card'
import type { PropertyImage } from '@/types/api'
import { GalleryAddButton } from './components/GalleryAddButton'
import { SortableImage } from './components/SortableImage'
import { usePropertyImagesTab } from './usePropertyImagesTab'

interface Props {
	propertyId: string
	images: PropertyImage[]
	/** Open an image's standalone detail page (where it can be edited/removed). */
	onOpen: (imageId: string) => void
}

/** Gallery of the images linked to a property: an "Add photo" action plus the
 *  thumbnails, which can be dragged (grip handle on each tile) to reorder. The
 *  new order is saved to `/properties/{id}/images/reorder/` on drop. Relink and
 *  per-image replace/delete still live on the standalone Property Images pages. */
export function PropertyImagesTab({ propertyId, images, onOpen }: Props) {
	const { tiles, ids, sensors, handleDragEnd } = usePropertyImagesTab(
		propertyId,
		images,
	)

	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<GalleryAddButton propertyId={propertyId} />
			</div>

			{!tiles.length ? (
				<Card>
					<CardContent className="py-10 text-center text-sm text-muted-foreground">
						No images linked to this property
					</CardContent>
				</Card>
			) : (
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					modifiers={[restrictToParentElement]}
					onDragEnd={handleDragEnd}
				>
					<SortableContext items={ids} strategy={rectSortingStrategy}>
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
							{tiles.map((tile) => (
								<SortableImage
									key={tile.id}
									id={tile.id}
									src={tile.src}
									onOpen={() => onOpen(tile.id)}
								/>
							))}
						</div>
					</SortableContext>
				</DndContext>
			)}
		</div>
	)
}
