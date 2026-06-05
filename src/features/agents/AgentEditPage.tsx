import { useNavigate, useParams } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAgent } from './hooks'
import { AgentForm } from './AgentForm'

export function AgentEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: agent, isLoading } = useAgent(id)

	return (
		<div>
			<PageHeader
				title="Edit agent"
				actions={
					<Button
						variant="outline"
						onClick={() => navigate(`/agents/${id}`)}
						aria-label="Back"
					>
						<Icon name="arrow-left" />
						<span className="sm:inline hidden">Back</span>
					</Button>
				}
			/>
			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					{isLoading || !agent ? (
						<div className="space-y-3">
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-2/3" />
						</div>
					) : (
						<AgentForm
							agent={agent}
							onSuccess={(a) => navigate(`/agents/${a.id}`)}
							onCancel={() => navigate(`/agents/${id}`)}
						/>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
