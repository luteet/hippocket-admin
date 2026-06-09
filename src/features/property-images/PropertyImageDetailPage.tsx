import { DetailPage } from '@/components/detail/DetailPage'
import { resolveMediaUrl } from '@/lib/media'
import { Icon } from '@/components/Icon'
import { usePropertyImageDetailPage } from './usePropertyImageDetailPage'

export function PropertyImageDetailPage() {
	const { image, isLoading, isDeleting, handleDelete, goBack, goToEdit } =
		usePropertyImageDetailPage()

	const src = resolveMediaUrl(image?.image_large || image?.image)

	return (
		<DetailPage
			title="Property Image"
			onBack={goBack}
			ready={Boolean(image)}
			isLoading={isLoading}
			onEdit={goToEdit}
			onDelete={handleDelete}
			deleteTitle="Delete image?"
			deleteDescription="This image will be permanently removed."
			isDeleting={isDeleting}
			header={
				image ? (
					<div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-md border border-border bg-muted text-muted-foreground">
						{src ? (
							<img
								src={src}
								alt=""
								className="size-full object-contain"
							/>
						) : (
							<Icon name="image" className="size-10" />
						)}
					</div>
				) : undefined
			}
			fields={
				image
					? [
							{
								label: 'Property',
								value: image.property_address ?? '',
							},
							{ label: 'Sort', value: image.sort },
							{
								label: 'Linked',
								bool: image.property_id != null,
							},
						]
					: undefined
			}
		/>
	)
}
