import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { PropertyImage } from '@/types/api'
import { usePropertySearch, useUpdatePropertyImage } from './hooks'

// '' = unlinked (no property).
export const UNLINKED = ''

const schema = z.object({
	sort: z.number({ message: 'Enter a number' }),
	// Stringified property id; '' means "unlinked".
	property_id: z.string(),
})

export type PropertyImageFormValues = z.infer<typeof schema>

function defaults(image: PropertyImage): PropertyImageFormValues {
	return {
		sort: image.sort,
		property_id: image.property_id ?? UNLINKED,
	}
}

interface Params {
	image: PropertyImage
	onSuccess: (image: PropertyImage) => void
}

export function usePropertyImageForm({ image, onSuccess }: Params) {
	const updateMut = useUpdatePropertyImage()

	const form = useForm<PropertyImageFormValues>({
		resolver: zodResolver(schema),
		defaultValues: defaults(image),
	})
	const { handleSubmit, reset } = form

	useEffect(() => {
		reset(defaults(image))
	}, [image, reset])

	// Properties are searched server-side and paged in as the user scrolls.
	const [propertySearch, setPropertySearch] = useState('')
	const {
		data: propertyPages,
		isFetching,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = usePropertySearch(propertySearch)

	const onSubmit = handleSubmit(async (values) => {
		try {
			const updated = await updateMut.mutateAsync({
				id: image.id,
				dto: {
					sort: values.sort,
					property_id:
						values.property_id === UNLINKED
							? null
							: values.property_id,
				},
			})
			toast.success('Image updated')
			onSuccess(updated)
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to save'))
		}
	})

	return {
		form,
		propertyOptions: (propertyPages?.pages ?? []).flatMap((p) =>
			p.items.map((o) => ({ value: o.id, label: o.address })),
		),
		propertiesLoading: isFetching && !isFetchingNextPage,
		onPropertySearch: setPropertySearch,
		hasMoreProperties: hasNextPage,
		loadingMoreProperties: isFetchingNextPage,
		onLoadMoreProperties: () => {
			if (hasNextPage && !isFetchingNextPage) fetchNextPage()
		},
		// Name the currently-linked property in the trigger before any search runs.
		selectedPropertyLabel: image.property_address ?? undefined,
		isPending: updateMut.isPending,
		onSubmit,
	}
}
