import { MediaUpload } from '@/components/media/MediaUpload'
import { useReplacePropertyImageFile } from '../hooks'

interface Props {
	imageId: string
	imageUrl: string | null
}

/** Property-image-specific wiring of the shared {@link MediaUpload} to
 *  `PUT /property-images/{id}/image/` (replaces the file, regenerating the
 *  resized versions). */
export function ImageFileUpload({ imageId, imageUrl }: Props) {
	const replaceMut = useReplacePropertyImageFile()

	return (
		<MediaUpload
			url={imageUrl}
			shape="square"
			placeholderIcon="image"
			accept="image/png,image/jpeg,image/webp"
			uploadLabel="Upload photo"
			changeLabel="Replace photo"
			successMessage="Photo replaced"
			errorFallback="Failed to replace photo"
			onUpload={async (file) => {
				const updated = await replaceMut.mutateAsync({
					id: imageId,
					file,
				})
				return updated.image_medium || updated.image
			}}
		/>
	)
}
