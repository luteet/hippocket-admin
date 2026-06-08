import { useNavigate } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChatForm } from './ChatForm'

export function ChatCreatePage() {
	const navigate = useNavigate()

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title="New chat"
					actions={
						<Button
							variant="outline"
							onClick={() => navigate('/chats')}
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
						<ChatForm
							onSuccess={(c) => navigate(`/chats/${c.id}`)}
							onCancel={() => navigate('/chats')}
						/>
					</Reveal>
				</CardContent>
			</Card>
		</div>
	)
}
