import { Icon } from '@/components/Icon'
import { PageHeader } from './PageHeader'
import { Card, CardContent } from '@/components/ui/card'

export function ComingSoon({ title }: { title: string }) {
	return (
		<div>
			<PageHeader title={title} />
			<Card>
				<CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground">
					<Icon
						name="construction"
						className="size-10 text-secondary"
					/>
					<p>This section is coming in a future iteration.</p>
				</CardContent>
			</Card>
		</div>
	)
}
