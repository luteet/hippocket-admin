// Chats — direct conversations between two agents, backed by /chats/,
// /chats/messages/, and /chats/media/. The Postman collection documents the
// endpoints but ships no response examples; these shapes were captured live
// from the dev API.

/** A chat groups exactly two participating agents (`user_ids`). */
export interface Chat {
	id: string
	user_ids: string[]
	/** Comma-separated participant emails, e.g. "a@x.com, b@y.com". */
	user_list: string
	messages_count: number
	created_at: string
}

export interface ChatsData {
	count: number
	items: Chat[]
	offset: number
	total: number
}

/** POST/PUT /chats/ — a chat's participants (exactly two agent ids). */
export interface ChatParticipantsDto {
	user_ids: string[]
}

export type CreateChatDto = ChatParticipantsDto
export type UpdateChatDto = ChatParticipantsDto

export interface ChatMessage {
	id: string
	chat_id: string
	user_id: string
	user_email: string
	text: string
	is_read: boolean
	/** Media file paths attached to the message (uploaded via the chat socket). */
	files: string[]
	created_at: string
}

export interface ChatMessagesData {
	count: number
	items: ChatMessage[]
	offset: number
	total: number
}

/** POST /chats/messages/ — author a message as one of the chat's participants. */
export interface CreateChatMessageDto {
	chat_id: string
	user_id: string
	text: string
	is_read: boolean
}

/** PUT /chats/messages/{id}/ — the dev API accepts `text` and `is_read`. */
export interface UpdateChatMessageDto {
	text?: string
	is_read?: boolean
}

/** A media file shared in a chat. Read-only + delete (uploads go via socket). */
export interface ChatMedia {
	id: string
	message_id: string | null
	user_id: string
	user_email: string
	file: string
	created_at: string
}

export interface ChatMediaData {
	count: number
	items: ChatMedia[]
	offset: number
	total: number
}
