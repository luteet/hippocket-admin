import { useNavigate } from 'react-router'

import { Icon } from '@/components/Icon'
import { Badge } from '@/components/ui/badge'
import type { GroupFormPrice } from '@/types/api'

// Read-only list of the group prices attached to a form config (embedded in the
// form-config response). Each row links to its own Form Price edit page.
export function RelatedGroupPrices({ prices }: { prices: GroupFormPrice[] }) {
	const navigate = useNavigate()

	if (!prices.length) {
		return (
			<p className="text-sm text-muted-foreground">
				No group prices for this form yet.
			</p>
		)
	}

	return (
		<div className="divide-y rounded-xl border bg-card">
			{prices.map((p) => (
				<button
					key={p.id}
					type="button"
					onClick={() => navigate(`/group-form-prices/${p.id}/edit`)}
					className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-muted/50"
				>
					<div className="min-w-0">
						<p className="truncate font-medium">{p.name}</p>
						<p className="truncate text-sm text-muted-foreground">
							{p.group_name} · {p.price}
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Badge variant={p.is_active ? 'success' : 'muted'}>
							{p.is_active ? 'Active' : 'Inactive'}
						</Badge>
						<Icon
							name="chevron-right"
							className="size-4 text-muted-foreground"
						/>
					</div>
				</button>
			))}
		</div>
	)
}
