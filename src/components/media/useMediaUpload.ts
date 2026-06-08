import { useRef, useState, type ChangeEvent } from 'react'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'

interface Params {
	/** Current media URL (drives the initial preview). */
	url: string | null
	/** Performs the upload and resolves to the new URL (from the API response). */
	onUpload: (file: File) => Promise<string | null>
	/** Optional client-side size cap in bytes; rejected before any request. */
	maxSize?: number
	/** Toast shown on a successful upload. */
	successMessage?: string
	/** Fallback toast message when the upload fails. */
	errorFallback: string
}

function formatSize(bytes: number): string {
	if (bytes >= 1024 * 1024) return `${Math.round(bytes / (1024 * 1024))} MB`
	return `${Math.round(bytes / 1024)} KB`
}

export function useMediaUpload({
	url,
	onUpload,
	maxSize,
	successMessage,
	errorFallback,
}: Params) {
	const inputRef = useRef<HTMLInputElement>(null)
	// Locally tracked preview so the image updates immediately after upload
	// without the caller having to refetch (which could reset surrounding form
	// state). Seeded from `url`.
	const [preview, setPreview] = useState<string | null>(url)
	const [isUploading, setIsUploading] = useState(false)

	const openPicker = () => inputRef.current?.click()

	const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		// Reset the input so picking the same file again still fires `change`.
		e.target.value = ''
		if (!file) return
		if (maxSize && file.size > maxSize) {
			toast.error(`File must be ${formatSize(maxSize)} or smaller`)
			return
		}
		setIsUploading(true)
		try {
			const next = await onUpload(file)
			setPreview(next)
			if (successMessage) toast.success(successMessage)
		} catch (error) {
			toast.error(getApiErrorMessage(error, errorFallback))
		} finally {
			setIsUploading(false)
		}
	}

	return { inputRef, preview, isUploading, openPicker, onFileChange }
}
