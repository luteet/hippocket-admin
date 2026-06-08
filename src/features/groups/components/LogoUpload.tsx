import { MediaUpload } from '@/components/media/MediaUpload'
import { useUploadGroupLogo } from '../hooks'

interface Props {
	groupId: number
	logoUrl: string | null
}

/** Group-specific wiring of the shared {@link MediaUpload} to
 *  `PUT /groups/{id}/logo/`. Logo constraints are enforced server-side
 *  (SVG/PNG/JPG/WEBP, ≤500 KB, ≤512×512); we mirror the type/size limits here. */
export function LogoUpload({ groupId, logoUrl }: Props) {
	const uploadMut = useUploadGroupLogo()

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
					id: groupId,
					file,
				})
				return updated.logo_url
			}}
		/>
	)
}
