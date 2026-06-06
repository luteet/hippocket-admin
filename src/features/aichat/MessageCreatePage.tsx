import { useNavigate } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MessageForm } from './MessageForm'

export function MessageCreatePage() {
	const navigate = useNavigate()

	return (
		<div>
			<Reveal index={0}>
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
			</Reveal>
			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					<Reveal index={1}>
						<MessageForm
							onSuccess={(m) =>
								navigate(`/ai-chat/messages/${m.id}`)
							}
							onCancel={() => navigate('/ai-chat/messages')}
						/>
					</Reveal>
				</CardContent>
			</Card>
		</div>
	)
}
