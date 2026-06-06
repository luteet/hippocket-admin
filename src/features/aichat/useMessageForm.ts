import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { AiMessage } from '@/types/api'
import { useCreateMessage, useSessionRefs, useUpdateMessage } from './hooks'

const schema = z.object({
	session_id: z.string().min(1, 'Select a session'),
	role: z.enum(['user', 'assistant', 'function', 'tool']),
	content: z.string().min(1, 'Content is required'),
	is_visible: z.boolean(),
})

export type MessageFormValues = z.infer<typeof schema>

function defaults(message?: AiMessage | null): MessageFormValues {
	return {
		session_id: message?.session_id ?? '',
		role: message?.role ?? 'assistant',
		content: message?.content ?? '',
		is_visible: message?.is_visible ?? true,
	}
}

interface Params {
	message?: AiMessage | null
	onSuccess: (message: AiMessage) => void
}

export function useMessageForm({ message, onSuccess }: Params) {
	const isEdit = !!message
	const createMut = useCreateMessage()
	const updateMut = useUpdateMessage()
	const { data: sessionRefs, isLoading: sessionsLoading } = useSessionRefs()

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm<MessageFormValues>({
		resolver: zodResolver(schema),
		defaultValues: defaults(message),
	})

	// The edit page loads the message asynchronously — sync once it arrives.
	useEffect(() => {
		if (message) reset(defaults(message))
	}, [message, reset])

	const sessionId = watch('session_id')
	const role = watch('role')
	const isVisible = watch('is_visible')

	const onSubmit = handleSubmit(async (values) => {
		try {
			if (isEdit && message) {
				const updated = await updateMut.mutateAsync({
					id: message.id,
					// The session can't be moved — only role/content/visibility.
					dto: {
						role: values.role,
						content: values.content,
						is_visible: values.is_visible,
					},
				})
				toast.success('Message updated')
				onSuccess(updated)
			} else {
				const created = await createMut.mutateAsync({
					session_id: values.session_id,
					role: values.role,
					content: values.content,
					is_visible: values.is_visible,
				})
				toast.success('Message created')
				onSuccess(created)
			}
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to save'))
		}
	})

	return {
		isEdit,
		register,
		errors,
		setValue,
		sessionId,
		setSessionId: (value: string) => setValue('session_id', value),
		role,
		isVisible,
		sessionRefs: sessionRefs ?? [],
		sessionsLoading,
		isPending: createMut.isPending || updateMut.isPending,
		onSubmit,
	}
}
