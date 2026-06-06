import { Link } from 'react-router'

import { Icon } from '@/components/Icon'
import { Card } from '@/components/ui/card'

// A single metric tile: a big number over a muted label. When `to` is set, the
// whole card links to the related section, with an arrow in the corner.
export function StatCard({
	label,
	value,
	to,
}: {
	label: string
	value: string
	to?: string
}) {
	const body = (
		<>
			{to && (
				<Icon
					name="arrow-right"
					className="absolute right-3 top-3 size-4 text-muted-foreground transition-colors group-hover:text-primary"
				/>
			)}
			<p className="text-2xl font-semibold text-[#111111]">{value}</p>
			<p className="mt-1 text-sm text-muted-foreground">{label}</p>
		</>
	)

	if (to) {
		return (
			<Link
				to={to}
				aria-label={`Go to ${label}`}
				className="card-surface group relative block p-5 text-card-foreground transition-colors hover:bg-muted/40"
			>
				{body}
			</Link>
		)
	}

	return <Card className="relative p-5">{body}</Card>
}
