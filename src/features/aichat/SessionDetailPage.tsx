import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { DetailGrid, DetailRow } from '@/components/DetailList'
import { useSessionDetailPage } from './useSessionDetailPage'
import { formatDateTime } from './format'

export function SessionDetailPage() {
	const {
		session,
		isLoading,
		confirmOpen,
		setConfirmOpen,
		isDeleting,
		handleDelete,
		goBack,
		goToMessages,
	} = useSessionDetailPage()

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title="AI Chat Session"
					actions={
						<>
							<Button
								variant="outline"
								onClick={goBack}
								aria-label="Back"
							>
								<Icon name="arrow-left" />
								<span className="sm:inline hidden">Back</span>
							</Button>
							{session && (
								<>
									<Button
										variant="secondary"
										onClick={goToMessages}
										aria-label="View messages"
									>
										<Icon name="message-square" />
										<span className="sm:inline hidden">
											Messages
										</span>
									</Button>
									<Button
										variant="destructive"
										onClick={() => setConfirmOpen(true)}
										aria-label="Delete"
									>
										<Icon name="trash-2" />
										<span className="sm:inline hidden">
											Delete
										</span>
									</Button>
								</>
							)}
						</>
					}
				/>
			</Reveal>

			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					{isLoading || !session ? (
						<div className="space-y-3">
							<Skeleton className="h-6 w-1/2" />
							<Skeleton className="h-5 w-2/3" />
							<Skeleton className="h-5 w-1/3" />
						</div>
					) : (
						<Reveal index={1}>
							<DetailGrid>
								<DetailRow
									label="User"
									value={session.user_email}
								/>
								<DetailRow
									label="User ID"
									value={session.user_id}
								/>
								<DetailRow
									label="Messages"
									value={String(session.messages_count)}
								/>
								<DetailRow
									label="Session ID"
									value={session.id}
								/>
								<DetailRow
									label="Created"
									value={formatDateTime(session.created_at)}
								/>
								<DetailRow
									label="Updated"
									value={formatDateTime(session.updated_at)}
								/>
							</DetailGrid>
						</Reveal>
					)}
				</CardContent>
			</Card>

			<ConfirmDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title="Delete session?"
				description={`Session for "${session?.user_email ?? ''}" and its messages will be permanently deleted.`}
				confirmLabel="Delete"
				destructive
				loading={isDeleting}
				onConfirm={handleDelete}
			/>
		</div>
	)
}
