import { Link } from 'react-router'
import { FileQuestion } from 'lucide-react'

import { PageHeader } from './PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function NotFound() {
	return (
		<div>
			<PageHeader title="Not Found" />
			<Card>
				<CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center text-muted-foreground">
					<FileQuestion className="size-10 text-secondary" />
					<p>
						The page you are looking for doesn’t exist or has been
						moved.
					</p>
					<Button asChild className="mt-2">
						<Link to="/partners">Back to Partners</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}
