import { Icon, type IconName } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { resolveMediaUrl } from '@/lib/media'
import { useMediaUpload } from './useMediaUpload'

export interface DocumentUploadProps {
	/** Current file URL, or null when nothing is uploaded yet. */
	url: string | null
	/** Performs the upload and resolves to the new URL from the API response. */
	onUpload: (file: File) => Promise<string | null>
	/** Accepted file types for the picker. Defaults to any file. */
	accept?: string
	/** Optional client-side size cap in bytes. */
	maxSize?: number
	/** Icon shown alongside the file (default `file-text`). */
	icon?: IconName
	/** Label shown when no file is set yet. */
	emptyLabel?: string
	/** Button label when no file is set yet. */
	uploadLabel?: string
	/** Button label when replacing an existing file. */
	changeLabel?: string
	/** Toast on success (omit for none). */
	successMessage?: string
	/** Fallback toast message on failure. */
	errorFallback?: string
	disabled?: boolean
}

/** Derive a human-readable filename from a media URL. */
function fileNameFromUrl(url: string): string {
	const last = url.split(/[?#]/)[0].split('/').pop() ?? url
	try {
		return decodeURIComponent(last)
	} catch {
		return last
	}
}

/**
 * Reusable document/file uploader — the non-image counterpart of {@link MediaUpload}.
 * Shows the current file as a download link (or an empty placeholder), lets the
 * user pick a file, and delegates the actual request to `onUpload` (each endpoint
 * differs — see the per-feature wrappers). Owns its own preview and loading state;
 * validation/toasts live in {@link useMediaUpload}.
 */
export function DocumentUpload({
	url,
	onUpload,
	accept,
	maxSize,
	icon = 'file-text',
	emptyLabel = 'No file uploaded',
	uploadLabel = 'Upload',
	changeLabel = 'Replace',
	successMessage,
	errorFallback = 'Failed to upload',
	disabled,
}: DocumentUploadProps) {
	const { inputRef, preview, isUploading, openPicker, onFileChange } =
		useMediaUpload({
			url,
			onUpload,
			maxSize,
			successMessage,
			errorFallback,
		})

	const resolved = resolveMediaUrl(preview)

	return (
		<div className="flex items-center gap-3 rounded-md border border-border bg-muted/40 p-3">
			<div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground">
				<Icon name={icon} className="size-5" />
			</div>

			<div className="min-w-0 flex-1">
				{resolved ? (
					<a
						href={resolved}
						target="_blank"
						rel="noreferrer"
						className="block truncate text-sm font-medium text-primary hover:underline"
						title={fileNameFromUrl(resolved)}
					>
						{fileNameFromUrl(resolved)}
					</a>
				) : (
					<p className="truncate text-sm text-muted-foreground">
						{emptyLabel}
					</p>
				)}
			</div>

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
