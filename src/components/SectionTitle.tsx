import { type ReactNode } from 'react'

import { Separator } from '@/components/ui/separator'

export function SectionTitle({
	first,
	children,
}: {
	first?: boolean
	children: ReactNode
}) {
	return (
		<div className={first ? 'space-y-8' : 'space-y-8 pt-6'}>
			{!first && <Separator />}
			<p className="text-lg font-medium text-muted-foreground">
				{children}
			</p>
		</div>
	)
}
