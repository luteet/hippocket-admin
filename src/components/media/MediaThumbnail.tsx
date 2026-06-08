import { Icon, type IconName } from '@/components/Icon'
import { resolveMediaUrl } from '@/lib/media'

interface Props {
	/** Media URL (relative paths are resolved against the API origin). */
	url: string | null
	/** `circle` for avatars, `square` for logos/icons. */
	shape?: 'circle' | 'square'
	/** Icon shown when there's no image. */
	placeholderIcon?: IconName
	/** Tailwind sizing for the box (default `size-16`). */
	className?: string
}

/** The framed preview of a media image (or a placeholder icon when empty).
 *  Shared by {@link MediaUpload} and detail pages. */
export function MediaThumbnail({
	url,
	shape = 'square',
	placeholderIcon = 'image',
	className = 'size-16',
}: Props) {
	const resolved = resolveMediaUrl(url)
	const rounded = shape === 'circle' ? 'rounded-full' : 'rounded-md'

	return (
		<div
			className={`flex ${className} ${rounded} shrink-0 items-center justify-center overflow-hidden border border-border bg-muted text-muted-foreground`}
		>
			{resolved ? (
				<img src={resolved} alt="" className="size-full object-cover" />
			) : (
				<Icon name={placeholderIcon} className="size-7" />
			)}
		</div>
	)
}
