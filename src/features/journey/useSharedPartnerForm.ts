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
		defaultValues: { agent_email: '' },
	})
	const { handleSubmit, reset } = form

	// Apply the saved agent only once the option list has loaded. Radix Select
	// resolves the selected value to its label by reading the matching item's
	// text on mount; setting the value before the items exist leaves the
	// trigger blank, so we wait for both the record and the options.
	useEffect(() => {
		if (shared && agentRefs) reset(defaults(shared))
	}, [shared, agentRefs, reset])

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
