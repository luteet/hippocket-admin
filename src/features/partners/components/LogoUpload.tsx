import { MediaUpload } from '@/components/media/MediaUpload'
import { useUploadPartnerLogo } from '../hooks'

interface Props {
	partnerId: string
	logoUrl: string | null
}

/** Partner-specific wiring of the shared {@link MediaUpload} to
 *  `PUT /partners/{id}/logo/`. */
export function LogoUpload({ partnerId, logoUrl }: Props) {
	const uploadMut = useUploadPartnerLogo()

	return (
		<MediaUpload
			url={logoUrl}
			shape="square"
			fit="contain"
			placeholderIcon="image"
			accept="image/svg+xml,image/png,image/jpeg,image/webp"
			maxSize={500 * 1024}
			uploadLabel="Upload logo"
			changeLabel="Change logo"
			successMessage="Logo updated"
			errorFallback="Failed to upload logo"
			onUpload={async (file) => {
				const updated = await uploadMut.mutateAsync({
					id: partnerId,
					file,
				})
				return updated.logo_url
			}}
		/>
	)
}
