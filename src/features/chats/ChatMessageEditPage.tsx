import { useNavigate, useParams } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useChatMessage } from './hooks'
import { ChatMessageForm } from './ChatMessageForm'

export function ChatMessageEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: message, isLoading } = useChatMessage(id)

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title="Edit message"
					actions={
						<Button
							variant="outline"
							onClick={() => navigate(`/chats/messages/${id}`)}
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
					{isLoading || !message ? (
						<div className="space-y-3">
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-2/3" />
						</div>
					) : (
						<Reveal index={1}>
							<ChatMessageForm
								message={message}
								onSuccess={(m) =>
									navigate(`/chats/messages/${m.id}`)
								}
								onCancel={() =>
									navigate(`/chats/messages/${id}`)
								}
							/>
						</Reveal>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
