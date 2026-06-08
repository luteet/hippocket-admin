import { Icon, type IconName } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { MediaThumbnail } from './MediaThumbnail'
import { useMediaUpload } from './useMediaUpload'

export interface MediaUploadProps {
	/** Current media URL, or null when nothing is set yet. */
	url: string | null
	/** Performs the upload and resolves to the new URL from the API response. */
	onUpload: (file: File) => Promise<string | null>
	/** Accepted file types for the picker. Defaults to any image. */
	accept?: string
	/** Optional client-side size cap in bytes. */
	maxSize?: number
	/** Preview shape — `circle` for avatars, `square` for logos/icons. */
	shape?: 'circle' | 'square'
	/** How the preview image fills its box — `contain` avoids cropping (logos). */
	fit?: 'cover' | 'contain'
	/** Icon shown when there's no image yet. */
	placeholderIcon?: IconName
	/** Tailwind sizing for the preview box (default `size-16`). */
	previewClassName?: string
	/** Button label when no image is set yet. */
	uploadLabel?: string
	/** Button label when replacing an existing image. */
	changeLabel?: string
	/** Toast on success (omit for none). */
	successMessage?: string
	/** Fallback toast message on failure. */
	errorFallback?: string
	disabled?: boolean
}

/**
 * Reusable media uploader: shows the current image (or a placeholder), lets the
 * user pick a file, and delegates the actual request to `onUpload` (each media
 * endpoint differs — see the per-feature wrappers). Owns its own preview and
 * loading state; validation/toasts live in {@link useMediaUpload}.
 */
export function MediaUpload({
	url,
	onUpload,
	accept = 'image/*',
	maxSize,
	shape = 'square',
	fit = 'cover',
	placeholderIcon = 'image',
	previewClassName = 'size-16',
	uploadLabel = 'Upload',
	changeLabel = 'Change',
	successMessage,
	errorFallback = 'Failed to upload',
	disabled,
}: MediaUploadProps) {
	const { inputRef, preview, isUploading, openPicker, onFileChange } =
		useMediaUpload({
			url,
			onUpload,
			maxSize,
			successMessage,
			errorFallback,
		})

	return (
		<div className="flex items-center gap-4">
			<MediaThumbnail
				url={preview}
				shape={shape}
				fit={fit}
				placeholderIcon={placeholderIcon}
				className={previewClassName}
			/>

			<input
				ref={inputRef}
				type="file"
				accept={accept}
				className="hidden"
				onChange={onFileChange}
			/>

			<Button
				type="button"
				variant="outline"
				onClick={openPicker}
				disabled={disabled || isUploading}
			>
				{isUploading ? (
					<Icon name="loader" className="animate-spin" />
				) : (
					<Icon name="upload" />
				)}
				{preview ? changeLabel : uploadLabel}
			</Button>
		</div>
	)
}
