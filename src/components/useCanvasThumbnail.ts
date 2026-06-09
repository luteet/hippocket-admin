import { useEffect, useRef, useState } from 'react'

/** Side length (px) of the square thumbnail rendered into the canvas. */
export const THUMBNAIL_SIZE = 512

type Status = 'loading' | 'ready' | 'error'

/** How the source image fills the square canvas: `cover` crops to fill,
 *  `contain` fits the whole image (transparent margins show the box behind). */
export type CanvasFit = 'cover' | 'contain'

/** Loads `src` and paints a downscaled thumbnail into a canvas.
 *  We deliberately do NOT set `crossOrigin`, so a cross-origin image with no
 *  CORS headers still loads and draws — the canvas just becomes tainted (which
 *  is fine, we only display it and never read its pixels back). */
export function useCanvasThumbnail(
	src: string,
	fit: CanvasFit = 'cover',
	size: number,
) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [status, setStatus] = useState<Status>('loading')
	const [activeKey, setActiveKey] = useState(`${fit}|${src}`)

	// Reset to loading when the source (or fit) changes — render-phase, the
	// React-recommended alternative to calling setState inside an effect.
	if (`${fit}|${src}` !== activeKey) {
		setActiveKey(`${fit}|${src}`)
		setStatus('loading')
	}

	useEffect(() => {
		const img = new Image()
		let cancelled = false

		img.onload = () => {
			if (cancelled) return
			const canvas = canvasRef.current
			const ctx = canvas?.getContext('2d')
			if (!canvas || !ctx) {
				setStatus('error')
				return
			}

			canvas.width = size
			canvas.height = size

			// cover → fill the square (cropping overflow); contain → fit inside.
			const ratioW = size / img.naturalWidth
			const ratioH = size / img.naturalHeight
			const scale =
				fit === 'contain'
					? Math.min(ratioW, ratioH)
					: Math.max(ratioW, ratioH)
			const drawW = img.naturalWidth * scale
			const drawH = img.naturalHeight * scale
			const offsetX = (size - drawW) / 2
			const offsetY = (size - drawH) / 2

			ctx.imageSmoothingQuality = 'high'
			ctx.clearRect(0, 0, size, size)
			ctx.drawImage(img, offsetX, offsetY, drawW, drawH)
			setStatus('ready')
		}

		img.onerror = () => {
			if (!cancelled) setStatus('error')
		}

		img.src = src

		return () => {
			cancelled = true
		}
	}, [src, fit, size])

	return { canvasRef, status }
}
