import { useRef, type ChangeEvent } from 'react'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import { useAddPropertyImage } from '@/features/property-images/hooks'

/** File-picker + upload logic for {@link GalleryAddButton}. Mirrors the
 *  mechanics of {@link useMediaUpload} but POSTs a new gallery photo instead of
 *  replacing one, and has no preview of its own (the list re-renders on success). */
export function useGalleryAddButton(propertyId: string) {
	const inputRef = useRef<HTMLInputElement>(null)
	const addMut = useAddPropertyImage()

	const openPicker = () => inputRef.current?.click()

	const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		// Reset the input so picking the same file again still fires `change`.
		e.target.value = ''
		if (!file) return
		try {
			await addMut.mutateAsync({ propertyId, file })
			toast.success('Photo added')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to add photo'))
		}
	}

	return {
		inputRef,
		isUploading: addMut.isPending,
		openPicker,
		onFileChange,
	}
}
