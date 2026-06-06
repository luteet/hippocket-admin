import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { CatalogItemDto, CatalogRecord } from '@/types/api'
import { useCreateCatalogItem, useUpdateCatalogItem } from './hooks'
import { REFERENCE_CONFIG, type ReferenceKind } from './useReferenceListPage'

const schema = z.object({
	name: z.string().min(1, 'Required'),
	sort: z
		.number({ message: 'Required' })
		.int('Must be a whole number')
		.min(0, 'Must be zero or greater'),
	description: z.string(),
	keywords: z.string(),
})

export type ReferenceFormValues = z.infer<typeof schema>

function defaults(item?: CatalogRecord | null): ReferenceFormValues {
	return {
		name: item?.name ?? '',
		sort: item?.sort ?? 0,
		description: item?.description ?? '',
		keywords: item?.keywords ?? '',
	}
}

interface Params {
	kind: ReferenceKind
	item?: CatalogRecord | null
	onSuccess: (item: CatalogRecord) => void
}

export function useReferenceForm({ kind, item, onSuccess }: Params) {
	const config = REFERENCE_CONFIG[kind]
	const isEdit = !!item
	const createMut = useCreateCatalogItem(
		config.queryKey,
		config.queryKey,
		config.endpoint,
	)
	const updateMut = useUpdateCatalogItem(
		config.queryKey,
		config.queryKey,
		config.endpoint,
	)

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ReferenceFormValues>({
		resolver: zodResolver(schema),
		defaultValues: defaults(item),
	})

	// The edit page loads the record asynchronously — sync the form once it arrives.
	useEffect(() => {
		if (item) reset(defaults(item))
	}, [item, reset])

	const onSubmit = handleSubmit(async (values) => {
		// Only the categories catalog stores description/keywords; for the others
		// send just name + sort.
		const dto: CatalogItemDto = config.hasContent
			? values
			: { name: values.name, sort: values.sort }
		try {
			if (isEdit && item) {
				const updated = await updateMut.mutateAsync({
					id: item.id,
					dto,
				})
				toast.success(`${config.singular} updated`)
				onSuccess(updated)
			} else {
				const created = await createMut.mutateAsync(dto)
				toast.success(`${config.singular} created`)
				onSuccess(created)
			}
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to save'))
		}
	})

	const isPending = createMut.isPending || updateMut.isPending

	return { config, register, errors, isPending, onSubmit }
}
