import { CanvasThumbnail } from '@/components/CanvasThumbnail'
import { Icon, type IconName } from '@/components/Icon'
import { resolveMediaUrl } from '@/lib/media'
import { THUMBNAIL_SIZE } from '../useCanvasThumbnail'

interface Props {
	/** Media URL (relative paths are resolved against the API origin). */
	url: string | null
	/** `circle` for avatars, `square` for logos/icons. */
	shape?: 'circle' | 'square'
	/** Icon shown when there's no image. */
	placeholderIcon?: IconName
	/** Tailwind sizing for the box (default `size-16`). */
	className?: string
	/** How the image fills the box: `cover` crops to fill, `contain` fits the
	 *  whole image without cropping (e.g. logos). Defaults to `cover`. */
	fit?: 'cover' | 'contain'
	/** Render the image through a downscaling canvas instead of a plain `<img>`.
	 *  Use for potentially large/cross-origin source images. */
	canvas?: boolean
	size?: number
}

/** The framed preview of a media image (or a placeholder icon when empty).
 *  Shared by {@link MediaUpload} and detail pages. */
export function MediaThumbnail({
	url,
	shape = 'square',
	placeholderIcon = 'image',
	className = 'size-16',
	fit = 'cover',
	canvas = false,
	size = THUMBNAIL_SIZE,
}: Props) {
	const resolved = resolveMediaUrl(url)
	const rounded = shape === 'circle' ? 'rounded-full' : 'rounded-md'

	return (
		<div
			className={`flex ${className} ${rounded} shrink-0 items-center justify-center overflow-hidden border border-border bg-muted text-muted-foreground`}
		>
			{resolved ? (
				canvas ? (
					<CanvasThumbnail src={resolved} fit={fit} size={size} />
				) : (
					<img
						src={resolved}
						alt=""
						className={`size-full ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
					/>
				)
			) : (
				<Icon name={placeholderIcon} className="size-7" />
			)}
		</div>
	)
}
