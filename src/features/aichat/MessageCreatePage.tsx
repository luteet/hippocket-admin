import { useNavigate } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MessageForm } from './MessageForm'

export function MessageCreatePage() {
	const navigate = useNavigate()

	return (
		<div>
			<PageHeader
				title="New message"
				actions={
					<Button
						variant="outline"
						onClick={() => navigate('/ai-chat/messages')}
						aria-label="Back"
					>
						<Icon name="arrow-left" />
						<span className="sm:inline hidden">Back</span>
					</Button>
				}
			/>
			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					<MessageForm
						onSuccess={(m) => navigate(`/ai-chat/messages/${m.id}`)}
						onCancel={() => navigate('/ai-chat/messages')}
					/>
				</CardContent>
			</Card>
		</div>
	)
}
