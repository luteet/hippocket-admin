import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { resolveMediaUrl } from '@/lib/media'
import { usePropertyImagesTab } from './usePropertyImagesTab'

interface Props {
	propertyId: string
}

export function PropertyImagesTab({ propertyId }: Props) {
	const {
		images,
		isLoading,
		isReordering,
		handleMove,
		pendingDelete,
		setPendingDelete,
		isDeleting,
		handleDelete,
	} = usePropertyImagesTab(propertyId)

	return (
		<div className="space-y-4">
			{/* Uploads happen in the mobile app; admin upload is coming later. */}
			<Card>
				<CardContent className="flex items-center gap-3 py-4 text-sm text-muted-foreground">
					<Icon name="image" className="size-5 shrink-0" />
					Uploading images isn’t available yet — it’s coming later.
					You can reorder and remove existing images here.
				</CardContent>
			</Card>

			{isLoading ? (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
					<Skeleton className="aspect-square w-full" />
					<Skeleton className="aspect-square w-full" />
					<Skeleton className="aspect-square w-full" />
				</div>
			) : !images.length ? (
				<Card>
					<CardContent className="py-10 text-center text-sm text-muted-foreground">
						No images yet
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
					{images.map((image, index) => {
						const src = resolveMediaUrl(
							image.image_medium || image.image,
						)
						return (
							<Card key={image.id} className="overflow-hidden">
								<div className="flex aspect-square w-full items-center justify-center bg-muted text-muted-foreground">
									{src ? (
										<img
											src={src}
											alt=""
											className="size-full object-cover"
										/>
									) : (
										<Icon name="image" className="size-7" />
									)}
								</div>
								<CardContent className="flex items-center justify-between gap-1 p-2 sm:p-4">
									<div className="flex gap-1">
										<Button
											variant="ghost"
											size="icon"
											title="Move up"
											disabled={
												index === 0 || isReordering
											}
											onClick={() =>
												handleMove(image, -1)
											}
										>
											<Icon name="chevron-up" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											title="Move down"
											disabled={
												index === images.length - 1 ||
												isReordering
											}
											onClick={() => handleMove(image, 1)}
										>
											<Icon name="chevron-down" />
										</Button>
									</div>
									<Button
										variant="ghost"
										size="icon"
										title="Delete image"
										onClick={() => setPendingDelete(image)}
									>
										<Icon name="trash-2" />
									</Button>
								</CardContent>
							</Card>
						)
					})}
				</div>
			)}

			<ConfirmDialog
				open={!!pendingDelete}
				onOpenChange={(open) => !open && setPendingDelete(null)}
				title="Delete image?"
				description="This image will be permanently removed from the property."
				confirmLabel="Delete"
				destructive
				loading={isDeleting}
				onConfirm={handleDelete}
			/>
		</div>
	)
}
