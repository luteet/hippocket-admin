import type { ReactNode } from 'react'

import { Icon, type IconName } from '@/components/Icon'

// A friendly empty state for lists: an icon, a short title, an optional
// description, and an optional call-to-action (e.g. "Add partner" / "Clear
// filters"). Drops straight into DataTable's `emptyMessage` (a ReactNode).
export function EmptyState({
	icon = 'inbox',
	title,
	description,
	action,
}: {
	icon?: IconName
	title: string
	description?: string
	action?: ReactNode
}) {
	return (
		<div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
			<Icon name={icon} className="size-10 text-muted-foreground/60" />
			<p className="font-medium text-foreground">{title}</p>
			{description && (
				<p className="text-sm text-muted-foreground">{description}</p>
			)}
			{action && <div className="mt-2">{action}</div>}
		</div>
	)
}
