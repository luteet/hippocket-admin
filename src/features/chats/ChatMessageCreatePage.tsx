import { useNavigate, useSearchParams } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChatMessageForm } from './ChatMessageForm'

export function ChatMessageCreatePage() {
	const navigate = useNavigate()
	// A chat may be pre-selected via `?chat=…` (e.g. from a chat's Messages tab).
	const [searchParams] = useSearchParams()
	const initialChatId = searchParams.get('chat') ?? undefined

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title="New message"
					actions={
						<Button
							variant="outline"
							onClick={() => navigate('/chats/messages')}
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
						<ChatMessageForm
							initialChatId={initialChatId}
							onSuccess={(m) =>
								navigate(`/chats/messages/${m.id}`)
							}
							onCancel={() => navigate('/chats/messages')}
						/>
					</Reveal>
				</CardContent>
			</Card>
		</div>
	)
}
