import { DetailPage } from '@/components/detail/DetailPage'
import { DetailPageProvider } from '@/components/detail/DetailPageContext'
import { resolveMediaUrl } from '@/lib/media'
import { Icon } from '@/components/Icon'
import { SectionTitle } from '@/components/SectionTitle'
import { ImageFileUpload } from './components/ImageFileUpload'
import { usePropertyImageDetailPage } from './usePropertyImageDetailPage'

export function PropertyImageDetailPage() {
	const { image, ...detailCtx } = usePropertyImageDetailPage()

	const src = resolveMediaUrl(image?.image_large || image?.image)

	return (
		<DetailPageProvider value={detailCtx}>
			<DetailPage
				title="Property Image"
				deleteTitle="Delete image?"
				deleteDescription="This image will be permanently removed."
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
			>
				{image && (
					<>
						<SectionTitle>Photo</SectionTitle>
						<ImageFileUpload
							imageId={image.id}
							imageUrl={image.image_medium || image.image}
						/>
					</>
				)}
			</DetailPage>
		</DetailPageProvider>
	)
}
