import { MediaUpload } from '@/components/media/MediaUpload'
import { useUploadPartnerPreview } from '../hooks'

interface Props {
	partnerId: string
	previewUrl: string | null
}

/** Partner-specific wiring of the shared {@link MediaUpload} to
 *  `PUT /partners/{id}/preview/` (the video cover image). */
export function PreviewUpload({ partnerId, previewUrl }: Props) {
	const uploadMut = useUploadPartnerPreview()

	return (
		<MediaUpload
			url={previewUrl}
			shape="square"
			placeholderIcon="image"
			accept="image/png,image/jpeg,image/webp"
			maxSize={5 * 1024 * 1024}
			previewClassName="h-16 w-28"
			uploadLabel="Upload cover"
			changeLabel="Change cover"
			successMessage="Video cover updated"
			errorFallback="Failed to upload video cover"
			onUpload={async (file) => {
				const updated = await uploadMut.mutateAsync({
					id: partnerId,
					file,
				})
				return updated.preview_url
			}}
		/>
	)
}
