import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { SharedPartner } from '@/types/api'
import {
	useAgentSearch,
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

	// Agents are searched server-side and paged in as the user scrolls (there
	// are far more than fit one request); `agentSearch` drives the option list.
	const [agentSearch, setAgentSearch] = useState('')
	const {
		data: agentPages,
		isFetching,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useAgentSearch(agentSearch)

	const form = useForm<SharedPartnerFormValues>({
		resolver: zodResolver(schema),
		defaultValues: defaults(shared),
	})
	const { handleSubmit, reset } = form

	// The edit page loads the record asynchronously — sync once it arrives. The
	// Combobox shows the saved agent's email via `selectedLabel` until a search
	// pulls its full option in, so this no longer waits on the option list.
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
		agentOptions: (agentPages?.pages ?? []).flatMap((p) =>
			p.items.map((a) => ({
				value: a.email,
				label: a.name ? `${a.name} (${a.email})` : a.email,
			})),
		),
		// Spinner for the initial/search load only — not while paging more in
		// (that has its own indicator at the foot of the list).
		agentsLoading: isFetching && !isFetchingNextPage,
		onAgentSearch: setAgentSearch,
		hasMoreAgents: hasNextPage,
		loadingMoreAgents: isFetchingNextPage,
		onLoadMoreAgents: () => {
			if (hasNextPage && !isFetchingNextPage) fetchNextPage()
		},
		// On edit, name the saved agent in the trigger before any search runs.
		selectedAgentLabel: shared?.agent_email,
		isPending: createMut.isPending || updateMut.isPending,
		onSubmit,
	}
}
