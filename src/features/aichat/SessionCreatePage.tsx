import { useNavigate } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SessionForm } from './SessionForm'

export function SessionCreatePage() {
	const navigate = useNavigate()

	return (
		<div>
			<PageHeader
				title="New session"
				actions={
					<Button
						variant="outline"
						onClick={() => navigate('/ai-chat/sessions')}
						aria-label="Back"
					>
						<Icon name="arrow-left" />
						<span className="sm:inline hidden">Back</span>
					</Button>
				}
			/>
			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					<SessionForm
						onSuccess={(s) => navigate(`/ai-chat/sessions/${s.id}`)}
						onCancel={() => navigate('/ai-chat/sessions')}
					/>
				</CardContent>
			</Card>
		</div>
	)
}
