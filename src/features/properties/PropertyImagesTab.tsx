import { useMemo } from 'react'

import { CanvasThumbnail } from '@/components/CanvasThumbnail'
import { Icon } from '@/components/Icon'
import { Card, CardContent } from '@/components/ui/card'
import { resolveMediaUrl } from '@/lib/media'
import type { PropertyImage } from '@/types/api'
import { GalleryAddButton } from './components/GalleryAddButton'

interface Props {
	propertyId: string
	images: PropertyImage[]
	/** Open an image's standalone detail page (where it can be edited/removed). */
	onOpen: (imageId: string) => void
}

/** Gallery of the images linked to a property: an "Add photo" action plus the
 *  thumbnails. Reorder, relink, and per-image replace/delete live on the
 *  standalone Property Images pages. */
export function PropertyImagesTab({ propertyId, images, onOpen }: Props) {
	const ordered = useMemo(
		() => [...images].sort((a, b) => a.sort - b.sort),
		[images],
	)

	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<GalleryAddButton propertyId={propertyId} />
			</div>

			{!ordered.length ? (
				<Card>
					<CardContent className="py-10 text-center text-sm text-muted-foreground">
						No images linked to this property
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
					{ordered.map((image) => {
						const src = resolveMediaUrl(
							image.image_medium || image.image,
						)
						return (
							<button
								key={image.id}
								type="button"
								onClick={() => onOpen(image.id)}
								title="Open image"
								className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border border-border bg-muted text-muted-foreground transition-opacity hover:opacity-80"
							>
								{src ? (
									<CanvasThumbnail src={src} />
								) : (
									<Icon name="image" className="size-7" />
								)}
							</button>
						)
					})}
				</div>
			)}
		</div>
	)
}
