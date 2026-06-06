import type { AiMessageRole } from '@/types/api'
import type { BadgeProps } from '@/components/ui/badge'

export { formatDateTime } from '@/lib/format'

/** Badge variant used to colour-code a message role. */
export function roleBadgeVariant(role: AiMessageRole): BadgeProps['variant'] {
	switch (role) {
		case 'assistant':
			return 'default'
		case 'user':
			return 'secondary'
		case 'function':
			return 'warning'
		default:
			return 'muted'
	}
}

/** Collapse whitespace and clip long message content for table cells. */
export function previewContent(text: string, max = 90) {
	const clean = text.replace(/\s+/g, ' ').trim()
	return clean.length > max ? `${clean.slice(0, max)}…` : clean
}
