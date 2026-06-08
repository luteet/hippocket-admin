import { useNavigate, useParams } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useChat } from './hooks'
import { ChatForm } from './ChatForm'

export function ChatEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: chat, isLoading } = useChat(id)

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title="Edit chat"
					actions={
						<Button
							variant="outline"
							onClick={() => navigate(`/chats/${id}`)}
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
					{isLoading || !chat ? (
						<div className="space-y-3">
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-full" />
						</div>
					) : (
						<Reveal index={1}>
							<ChatForm
								chat={chat}
								onSuccess={(c) => navigate(`/chats/${c.id}`)}
								onCancel={() => navigate(`/chats/${id}`)}
							/>
						</Reveal>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
