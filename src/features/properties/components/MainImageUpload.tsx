import { MediaUpload } from '@/components/media/MediaUpload'
import { useUploadPropertyImage } from '../hooks'

interface Props {
	propertyId: string
	imageUrl: string | null
}

/** Property-specific wiring of the shared {@link MediaUpload} to
 *  `PUT /properties/{id}/image/` (the main photo). */
export function MainImageUpload({ propertyId, imageUrl }: Props) {
	const uploadMut = useUploadPropertyImage()

	return (
		<MediaUpload
			url={imageUrl}
			shape="square"
			placeholderIcon="image"
			accept="image/png,image/jpeg,image/webp"
			uploadLabel="Upload photo"
			changeLabel="Change photo"
			successMessage="Photo updated"
			errorFallback="Failed to upload photo"
			onUpload={async (file) => {
				const updated = await uploadMut.mutateAsync({
					id: propertyId,
					file,
				})
				return updated.image
			}}
		/>
	)
}
