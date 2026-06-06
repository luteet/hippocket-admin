import { Badge } from '@/components/ui/badge'
import type { AiMessageRole } from '@/types/api'
import { roleBadgeVariant } from '../format'

export function RoleBadge({ role }: { role: AiMessageRole }) {
	return (
		<Badge variant={roleBadgeVariant(role)} className="capitalize">
			{role}
		</Badge>
	)
}
