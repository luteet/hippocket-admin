import { API_BASE_URL } from '@/lib/api/client'

export { formatDateTime } from '@/lib/format'

/** Collapse whitespace and clip long message text for table cells. */
export function previewText(text: string, max = 90) {
	const clean = text.replace(/\s+/g, ' ').trim()
	return clean.length > max ? `${clean.slice(0, max)}…` : clean
}

/** The trailing filename of a media path: "/media/chat_media/x.png" → "x.png". */
export function fileName(path: string) {
	const parts = path.split('/')
	return parts[parts.length - 1] || path
}

/** Absolute URL for a media file path, served from the API host (not /admin-api). */
export function mediaUrl(path: string) {
	return `${API_BASE_URL}${path}`
}

/** Whether a media path points at an image we can preview inline. */
export function isImage(path: string) {
	return /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(path)
}

/** Participants of a chat as `{ id, email }`, pairing `user_ids` with `user_list`. */
export function chatParticipants(
	userIds: string[],
	userList: string,
): { id: string; email: string }[] {
	const emails = userList.split(',').map((e) => e.trim())
	return userIds.map((id, i) => ({ id, email: emails[i] ?? id }))
}
