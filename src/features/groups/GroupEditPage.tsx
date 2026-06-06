import { useNavigate, useParams } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGroup } from './hooks'
import { GroupForm } from './GroupForm'

export function GroupEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const numericId = id ? Number(id) : undefined
	const { data: group, isLoading } = useGroup(numericId)

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title="Edit group"
					actions={
						<Button
							variant="outline"
							onClick={() => navigate(`/groups/${id}`)}
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
					{isLoading || !group ? (
						<div className="space-y-3">
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-2/3" />
						</div>
					) : (
						<Reveal index={1}>
							<GroupForm
								group={group}
								onSuccess={(g) => navigate(`/groups/${g.id}`)}
								onCancel={() => navigate(`/groups/${id}`)}
							/>
						</Reveal>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
