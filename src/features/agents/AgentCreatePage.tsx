import { useNavigate } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AgentForm } from './AgentForm'

export function AgentCreatePage() {
	const navigate = useNavigate()

	return (
		<div>
			<PageHeader
				title="New agent"
				actions={
					<Button
						variant="outline"
						onClick={() => navigate('/agents')}
						aria-label="Back"
					>
						<Icon name="arrow-left" />
						<span className="sm:inline hidden">Back</span>
					</Button>
				}
			/>
			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					<AgentForm
						onSuccess={(a) => navigate(`/agents/${a.id}`)}
						onCancel={() => navigate('/agents')}
					/>
				</CardContent>
			</Card>
		</div>
	)
}
