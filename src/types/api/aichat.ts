// AI Chat — sessions and messages, backed by /ai-chat/sessions/ and
// /ai-chat/messages/. The Postman collection documents the endpoints but ships
// no response examples; these shapes were captured live from the dev API.

/** Role of an AI chat message. The allowed set comes from
 * GET /ai-chat/messages/meta/ (`{ roles: [...] }`). */
export type AiMessageRole = 'user' | 'assistant' | 'function' | 'tool'

export interface AiSession {
	id: string
	user_id: string
	user_email: string
	messages_count: number
	created_at: string
	updated_at: string
}

export interface AiSessionsData {
	count: number
	items: AiSession[]
	offset: number
	total: number
}

/** POST /ai-chat/sessions/ — starts a session for an agent (the `user`). */
export interface CreateAiSessionDto {
	user_id: string
}

export interface AiMessage {
	id: string
	session_id: string
	session_user_email: string
	role: AiMessageRole
	content: string
	function_name: string | null
	function_call_id: string | null
	data: unknown | null
	is_visible: boolean
	created_at: string
}

export interface AiMessagesData {
	count: number
	items: AiMessage[]
	offset: number
	total: number
}

/** POST /ai-chat/messages/ */
export interface CreateAiMessageDto {
	session_id: string
	role: AiMessageRole
	content: string
	is_visible: boolean
}

/**
 * PUT /ai-chat/messages/{id}/ — a full update; the dev API accepts and applies
 * `role`, `content`, and `is_visible` (the session can't be moved).
 */
export interface UpdateAiMessageDto {
	role?: AiMessageRole
	content?: string
	is_visible?: boolean
}
