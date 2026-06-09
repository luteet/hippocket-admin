import { MediaUpload } from '@/components/media/MediaUpload'
import { useUploadCategoryIcon } from '../hooks'

interface Props {
	categoryId: string
	iconUrl: string | null
	/** Catalog/refs query key suffix to invalidate on success (always `categories`). */
	queryKey: string
}

/** Category-specific wiring of the shared {@link MediaUpload} to
 *  `PUT /catalogs/categories/{id}/icon/`. */
export function CategoryIconUpload({ categoryId, iconUrl, queryKey }: Props) {
	const uploadMut = useUploadCategoryIcon(queryKey, queryKey)

	return (
		<MediaUpload
			url={iconUrl}
			shape="square"
			fit="contain"
			placeholderIcon="image"
			accept="image/svg+xml,image/png,image/jpeg,image/webp"
			uploadLabel="Upload icon"
			changeLabel="Change icon"
			successMessage="Icon updated"
			errorFallback="Failed to upload icon"
			onUpload={async (file) => {
				const updated = await uploadMut.mutateAsync({
					id: categoryId,
					file,
				})
				return updated.icon ?? null
			}}
		/>
	)
}
