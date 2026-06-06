import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { AiSession } from '@/types/api'
import { useAgentRefOptions, useCreateSession } from './hooks'

const schema = z.object({
	user_id: z.string().min(1, 'Select an agent'),
})

export type SessionFormValues = z.infer<typeof schema>

interface Params {
	onSuccess: (session: AiSession) => void
}

export function useSessionForm({ onSuccess }: Params) {
	const createMut = useCreateSession()
	const { data: agentOptions, isLoading: agentsLoading } =
		useAgentRefOptions()

	const {
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<SessionFormValues>({
		resolver: zodResolver(schema),
		defaultValues: { user_id: '' },
	})

	const userId = watch('user_id')

	const onSubmit = handleSubmit(async (values) => {
		try {
			const created = await createMut.mutateAsync({
				user_id: values.user_id,
			})
			toast.success('Session created')
			onSuccess(created)
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to create'))
		}
	})

	return {
		errors,
		userId,
		setUserId: (value: string) => setValue('user_id', value),
		agentOptions: agentOptions ?? [],
		agentsLoading,
		isPending: createMut.isPending,
		onSubmit,
	}
}
