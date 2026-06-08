import { Badge } from '@/components/ui/badge'

/** Colour-coded badge for a message's read state. */
export function ReadBadge({ isRead }: { isRead: boolean }) {
	return isRead ? (
		<Badge variant="success">Read</Badge>
	) : (
		<Badge variant="muted">Unread</Badge>
	)
}
