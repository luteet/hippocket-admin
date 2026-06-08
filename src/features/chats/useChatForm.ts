import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { Chat } from '@/types/api'
import { useAgentRefOptions, useCreateChat, useUpdateChat } from './hooks'

// A chat has exactly two participating agents. Validate both are set and
// distinct; the form posts `user_ids: [user_a, user_b]`.
const schema = z
	.object({
		user_a: z.string().min(1, 'Select the first participant'),
		user_b: z.string().min(1, 'Select the second participant'),
	})
	.refine((v) => v.user_a !== v.user_b, {
		path: ['user_b'],
		message: 'Participants must be two different agents',
	})

export type ChatFormValues = z.infer<typeof schema>

function defaults(chat?: Chat | null): ChatFormValues {
	return {
		user_a: chat?.user_ids[0] ?? '',
		user_b: chat?.user_ids[1] ?? '',
	}
}

interface Params {
	chat?: Chat | null
	onSuccess: (chat: Chat) => void
}

export function useChatForm({ chat, onSuccess }: Params) {
	const isEdit = !!chat
	const createMut = useCreateChat()
	const updateMut = useUpdateChat()
	const { data: agentRefs, isLoading: agentsLoading } = useAgentRefOptions()

	const form = useForm<ChatFormValues>({
		resolver: zodResolver(schema),
		defaultValues: defaults(chat),
	})
	const { handleSubmit, reset } = form

	// The edit page loads the chat asynchronously — sync once it arrives.
	useEffect(() => {
		if (chat) reset(defaults(chat))
	}, [chat, reset])

	const onSubmit = handleSubmit(async (values) => {
		const dto = { user_ids: [values.user_a, values.user_b] }
		try {
			if (isEdit && chat) {
				const updated = await updateMut.mutateAsync({
					id: chat.id,
					dto,
				})
				toast.success('Chat updated')
				onSuccess(updated)
			} else {
				const created = await createMut.mutateAsync(dto)
				toast.success('Chat created')
				onSuccess(created)
			}
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to save'))
		}
	})

	return {
		form,
		agentRefs: agentRefs ?? [],
		agentsLoading,
		isPending: createMut.isPending || updateMut.isPending,
		onSubmit,
	}
}
