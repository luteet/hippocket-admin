import { useMemo, useState } from 'react'
import {
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'

import { resolveMediaUrl } from '@/lib/media'
import type { PropertyImage } from '@/types/api'
import { useReorderPropertyImages } from './hooks'

/**
 * Logic for the property gallery tab: orders the images by `sort`, derives the
 * drag-and-drop tiles, and persists a reorder on drop. The whole gallery is on
 * screen at once (one property, no paging/search), so dragging is always
 * available — no enabled/disabled gate.
 */
export function usePropertyImagesTab(
	propertyId: string,
	images: PropertyImage[],
) {
	const reorderMut = useReorderPropertyImages(propertyId)

	const sortedTiles = useMemo(
		() =>
			[...images]
				.sort((a, b) => a.sort - b.sort)
				.map((image) => ({
					id: image.id,
					src: resolveMediaUrl(image.image_medium || image.image),
				})),
		[images],
	)

	// A local mirror so a drop reorders the tiles synchronously — otherwise the
	// dropped tile snaps back to its origin for a frame before the (async) cache
	// update moves it. Resetting it during render (the React-blessed "derive
	// state from props" pattern) keeps it in sync with later image changes.
	const [tiles, setTiles] = useState(sortedTiles)
	const [prevSorted, setPrevSorted] = useState(sortedTiles)
	if (sortedTiles !== prevSorted) {
		setPrevSorted(sortedTiles)
		setTiles(sortedTiles)
	}

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		if (!over || active.id === over.id) return
		const ids = tiles.map((t) => t.id)
		const oldIndex = ids.indexOf(String(active.id))
		const newIndex = ids.indexOf(String(over.id))
		if (oldIndex === -1 || newIndex === -1) return
		const next = arrayMove(tiles, oldIndex, newIndex)
		setTiles(next)
		reorderMut.mutate(next.map((t) => t.id))
	}

	return {
		tiles,
		ids: tiles.map((t) => t.id),
		sensors,
		handleDragEnd,
	}
}
