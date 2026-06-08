import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { TeamLeader } from '@/types/api'
import { useGroupOptions } from '@/features/agents/hooks'
import { useCreateTeamLeader, useUpdateTeamLeader } from './hooks'

const schema = z.object({
	// 0 means "not selected" — the Select works with strings.
	group_id: z.number().int().positive('Select a group'),
	tl_name: z.string().min(1, 'Required'),
	tl_email: z.string().email('Enter a valid email'),
	tl_phone: z.string().min(1, 'Required'),
	office_location: z.string().min(1, 'Required'),
})

export type TeamLeaderFormValues = z.infer<typeof schema>

function defaults(leader?: TeamLeader | null): TeamLeaderFormValues {
	return {
		group_id: leader?.group_id ?? 0,
		tl_name: leader?.tl_name ?? '',
		tl_email: leader?.tl_email ?? '',
		tl_phone: leader?.tl_phone ?? '',
		office_location: leader?.office_location ?? '',
	}
}

interface Params {
	leader?: TeamLeader | null
	onSuccess: (leader: TeamLeader) => void
}

export function useTeamLeaderForm({ leader, onSuccess }: Params) {
	const isEdit = !!leader
	const createMut = useCreateTeamLeader()
	const updateMut = useUpdateTeamLeader()
	const { data: groupOptions } = useGroupOptions()

	const form = useForm<TeamLeaderFormValues>({
		resolver: zodResolver(schema),
		defaultValues: defaults(leader),
	})
	const { handleSubmit, reset } = form

	// The edit page loads the leader asynchronously — sync once it arrives.
	useEffect(() => {
		if (leader) reset(defaults(leader))
	}, [leader, reset])

	const onSubmit = handleSubmit(async (values) => {
		try {
			if (isEdit && leader) {
				const updated = await updateMut.mutateAsync({
					id: leader.id,
					dto: values,
				})
				toast.success('Team leader updated')
				onSuccess(updated)
			} else {
				const created = await createMut.mutateAsync(values)
				toast.success('Team leader created')
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
		groupOptions: groupOptions ?? [],
	}
}
