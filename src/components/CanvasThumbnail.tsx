import { Icon } from '@/components/Icon'

import {
	type CanvasFit,
	THUMBNAIL_SIZE,
	useCanvasThumbnail,
} from './useCanvasThumbnail'

interface Props {
	src: string
	/** `cover` crops to fill, `contain` fits the whole image. Defaults `cover`. */
	fit?: CanvasFit
	size?: number
}

/** Renders an image as a 512×512 canvas thumbnail. Source images can be very
 *  large, so we downscale them via canvas instead of shipping the full file to
 *  an `<img>`; this works even when the source is cross-origin without CORS. */
export function CanvasThumbnail({
	src,
	fit = 'cover',
	size = THUMBNAIL_SIZE,
}: Props) {
	const { canvasRef, status } = useCanvasThumbnail(src, fit, size)
	const objectFit = fit === 'contain' ? 'object-contain' : 'object-cover'

	return (
		<div className="relative flex size-full items-center justify-center">
			<canvas
				ref={canvasRef}
				className={`size-full ${objectFit} transition-opacity duration-300`}
				data-status={status}
				style={{ opacity: status === 'ready' ? 1 : 0 }}
			/>
			{status !== 'ready' && (
				<Icon
					name={status === 'error' ? 'image' : 'loader'}
					className={
						status === 'error'
							? 'absolute size-7'
							: 'absolute size-7 animate-spin'
					}
				/>
			)}
		</div>
	)
}
