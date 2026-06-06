import { useNavigate, useParams } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useStatus } from './hooks'
import { StatusForm } from './StatusForm'

export function StatusEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const numericId = id ? Number(id) : undefined
	const { data: status, isLoading } = useStatus(numericId)

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title="Edit status"
					actions={
						<Button
							variant="outline"
							onClick={() => navigate(`/statuses/${id}`)}
							aria-label="Back"
						>
							<Icon name="arrow-left" />
							<span className="sm:inline hidden">Back</span>
						</Button>
					}
				/>
			</Reveal>
			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					{isLoading ? (
						<div className="space-y-3">
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-2/3" />
						</div>
					) : !status ? (
						<p className="text-muted-foreground">
							Status not found
						</p>
					) : (
						<Reveal index={1}>
							<StatusForm
								status={status}
								onSuccess={(s) => navigate(`/statuses/${s.id}`)}
								onCancel={() => navigate(`/statuses/${id}`)}
							/>
						</Reveal>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
