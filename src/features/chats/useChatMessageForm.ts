import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { ChatMessage } from '@/types/api'
import {
	useChatRefs,
	useCreateChatMessage,
	useUpdateChatMessage,
} from './hooks'
import { chatParticipants } from './format'

const schema = z.object({
	chat_id: z.string().min(1, 'Select a chat'),
	user_id: z.string().min(1, 'Select the author'),
	text: z.string().min(1, 'Text is required'),
	is_read: z.boolean(),
})

export type ChatMessageFormValues = z.infer<typeof schema>

function defaults(
	message?: ChatMessage | null,
	initialChatId?: string,
): ChatMessageFormValues {
	return {
		chat_id: message?.chat_id ?? initialChatId ?? '',
		user_id: message?.user_id ?? '',
		text: message?.text ?? '',
		is_read: message?.is_read ?? false,
	}
}

interface Params {
	message?: ChatMessage | null
	/** Pre-select a chat when creating (e.g. from a chat's Messages tab). */
	initialChatId?: string
	onSuccess: (message: ChatMessage) => void
}

export function useChatMessageForm({
	message,
	initialChatId,
	onSuccess,
}: Params) {
	const isEdit = !!message
	const createMut = useCreateChatMessage()
	const updateMut = useUpdateChatMessage()
	const { data: chatRefs, isLoading: chatsLoading } = useChatRefs()

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm<ChatMessageFormValues>({
		resolver: zodResolver(schema),
		defaultValues: defaults(message, initialChatId),
	})

	// The edit page loads the message asynchronously — sync once it arrives.
	useEffect(() => {
		if (message) reset(defaults(message))
	}, [message, reset])

	const chatId = watch('chat_id')
	const userId = watch('user_id')
	const isRead = watch('is_read')

	// The author must be one of the selected chat's two participants.
	const selectedChat = (chatRefs ?? []).find((c) => c.id === chatId)
	const participants = selectedChat
		? chatParticipants(selectedChat.user_ids, selectedChat.user_list)
		: []

	const setChatId = (value: string) => {
		setValue('chat_id', value)
		// Clear an author that doesn't belong to the newly-selected chat.
		const next = (chatRefs ?? []).find((c) => c.id === value)
		if (!next || !next.user_ids.includes(userId)) {
			setValue('user_id', '')
		}
	}

	const onSubmit = handleSubmit(async (values) => {
		try {
			if (isEdit && message) {
				const updated = await updateMut.mutateAsync({
					id: message.id,
					// Only the text and read state are editable on a message.
					dto: { text: values.text, is_read: values.is_read },
				})
				toast.success('Message updated')
				onSuccess(updated)
			} else {
				const created = await createMut.mutateAsync({
					chat_id: values.chat_id,
					user_id: values.user_id,
					text: values.text,
					is_read: values.is_read,
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
		chatId,
		setChatId,
		userId,
		setUserId: (value: string) => setValue('user_id', value),
		isRead,
		participants,
		chatRefs: chatRefs ?? [],
		chatsLoading,
		isPending: createMut.isPending || updateMut.isPending,
		onSubmit,
	}
}
