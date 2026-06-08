import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { SavedFilter } from '@/types/api'
import {
	useAgentRefOptions,
	useCreateSavedFilter,
	useUpdateSavedFilter,
} from './hooks'

const schema = z.object({
	user_id: z.string().min(1, 'Required'),
	title: z.string(),
	value: z.string().min(1, 'Required'),
})

export type SavedFilterFormValues = z.infer<typeof schema>

function defaults(filter?: SavedFilter | null): SavedFilterFormValues {
	return {
		user_id: filter?.user_id ?? '',
		title: filter?.title ?? '',
		value: filter?.value ?? '',
	}
}

interface Params {
	filter?: SavedFilter | null
	onSuccess: (filter: SavedFilter) => void
}

export function useSavedFilterForm({ filter, onSuccess }: Params) {
	const isEdit = !!filter
	const createMut = useCreateSavedFilter()
	const updateMut = useUpdateSavedFilter()
	const { data: agentOptions, isLoading: isLoadingAgents } =
		useAgentRefOptions()

	const form = useForm<SavedFilterFormValues>({
		resolver: zodResolver(schema),
		defaultValues: defaults(filter),
	})
	const { handleSubmit, reset } = form

	// The edit page loads the filter asynchronously — sync once it arrives.
	useEffect(() => {
		if (filter) reset(defaults(filter))
	}, [filter, reset])

	const onSubmit = handleSubmit(async (values) => {
		try {
			if (isEdit && filter) {
				const updated = await updateMut.mutateAsync({
					id: filter.id,
					dto: { title: values.title, value: values.value },
				})
				toast.success('Saved filter updated')
				onSuccess(updated)
			} else {
				const created = await createMut.mutateAsync(values)
				toast.success('Saved filter created')
				onSuccess(created)
			}
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to save'))
		}
	})

	const isPending = createMut.isPending || updateMut.isPending

	return {
		isEdit,
		form,
		isPending,
		onSubmit,
		agentOptions: agentOptions ?? [],
		isLoadingAgents,
	}
}
