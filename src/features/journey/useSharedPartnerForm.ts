import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { SharedPartner } from '@/types/api'
import {
	useAgentRefOptions,
	useCreateSharedPartner,
	useUpdateSharedPartner,
} from './hooks'

const schema = z.object({
	agent_email: z.string().min(1, 'Select an agent'),
})

export type SharedPartnerFormValues = z.infer<typeof schema>

function defaults(shared?: SharedPartner | null): SharedPartnerFormValues {
	return { agent_email: shared?.agent_email ?? '' }
}

interface Params {
	shared?: SharedPartner | null
	onSuccess: (shared: SharedPartner) => void
}

export function useSharedPartnerForm({ shared, onSuccess }: Params) {
	const isEdit = !!shared
	const createMut = useCreateSharedPartner()
	const updateMut = useUpdateSharedPartner()
	const { data: agentRefs, isLoading: agentsLoading } = useAgentRefOptions()

	const form = useForm<SharedPartnerFormValues>({
		resolver: zodResolver(schema),
		defaultValues: defaults(shared),
	})
	const { handleSubmit, reset } = form

	// The edit page loads the record asynchronously — sync once it arrives.
	useEffect(() => {
		if (shared) reset(defaults(shared))
	}, [shared, reset])

	const onSubmit = handleSubmit(async (values) => {
		try {
			if (isEdit && shared) {
				const updated = await updateMut.mutateAsync({
					id: shared.id,
					dto: values,
				})
				toast.success('Shared partner updated')
				onSuccess(updated)
			} else {
				const created = await createMut.mutateAsync(values)
				toast.success('Shared partner created')
				onSuccess(created)
			}
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to save'))
		}
	})

	return {
		form,
		agentOptions: (agentRefs ?? []).map((a) => ({
			value: a.email,
			label: a.name ? `${a.name} (${a.email})` : a.email,
		})),
		agentsLoading,
		isPending: createMut.isPending || updateMut.isPending,
		onSubmit,
	}
}
