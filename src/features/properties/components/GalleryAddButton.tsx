import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { useGalleryAddButton } from './useGalleryAddButton'

interface Props {
	propertyId: string
}

/** Adds a new photo to a property's gallery via `POST /properties/{id}/images/`.
 *  Picks a single image file and uploads it; the gallery refreshes on success. */
export function GalleryAddButton({ propertyId }: Props) {
	const { inputRef, isUploading, openPicker, onFileChange } =
		useGalleryAddButton(propertyId)

	return (
		<>
			<input
				ref={inputRef}
				type="file"
				accept="image/png,image/jpeg,image/webp"
				className="hidden"
				onChange={onFileChange}
			/>
			<Button
				type="button"
				variant="outline"
				onClick={openPicker}
				disabled={isUploading}
			>
				{isUploading ? (
					<Icon name="loader" className="animate-spin" />
				) : (
					<Icon name="plus" />
				)}
				Add photo
			</Button>
		</>
	)
}
