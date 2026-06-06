import { useNavigate, useParams } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useMessage } from './hooks'
import { MessageForm } from './MessageForm'

export function MessageEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: message, isLoading } = useMessage(id)

	return (
		<div>
			<PageHeader
				title="Edit message"
				actions={
					<Button
						variant="outline"
						onClick={() => navigate(`/ai-chat/messages/${id}`)}
						aria-label="Back"
					>
						<Icon name="arrow-left" />
						<span className="sm:inline hidden">Back</span>
					</Button>
				}
			/>
			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					{isLoading || !message ? (
						<div className="space-y-3">
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-2/3" />
						</div>
					) : (
						<MessageForm
							message={message}
							onSuccess={(m) =>
								navigate(`/ai-chat/messages/${m.id}`)
							}
							onCancel={() => navigate(`/ai-chat/messages/${id}`)}
						/>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
