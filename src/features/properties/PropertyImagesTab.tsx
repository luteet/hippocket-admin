import { useMemo } from 'react'

import { CanvasThumbnail } from '@/components/CanvasThumbnail'
import { Icon } from '@/components/Icon'
import { Card, CardContent } from '@/components/ui/card'
import { resolveMediaUrl } from '@/lib/media'
import type { PropertyImage } from '@/types/api'

interface Props {
	images: PropertyImage[]
	/** Open an image's standalone detail page (where it can be edited/removed). */
	onOpen: (imageId: string) => void
}

/** Read-only gallery of the images linked to a property. Management (reorder,
 *  relink, delete) lives on the standalone Property Images pages. */
export function PropertyImagesTab({ images, onOpen }: Props) {
	const ordered = useMemo(
		() => [...images].sort((a, b) => a.sort - b.sort),
		[images],
	)

	if (!ordered.length) {
		return (
			<Card>
				<CardContent className="py-10 text-center text-sm text-muted-foreground">
					No images linked to this property
				</CardContent>
			</Card>
		)
	}

	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
			{ordered.map((image) => {
				const src = resolveMediaUrl(image.image_medium || image.image)
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
	)
}
