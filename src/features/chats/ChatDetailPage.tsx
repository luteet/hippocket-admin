import { AnimatePresence } from 'motion/react'

import { Icon } from '@/components/Icon'
import { PageTransition } from '@/components/PageTransition'
import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { DetailGrid, DetailRow } from '@/components/DetailList'
import { TabButton } from '@/components/TabButton'
import { useChatDetailPage } from './useChatDetailPage'
import { ChatMessagesTab } from './ChatMessagesTab'
import { formatDateTime } from './format'

export function ChatDetailPage() {
	const {
		chat,
		chatId,
		isLoading,
		tab,
		setTab,
		confirmOpen,
		setConfirmOpen,
		isDeleting,
		handleDelete,
		goBack,
		goToEdit,
	} = useChatDetailPage()

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title="Chat"
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
							{chat && (
								<>
									<Button
										variant="secondary"
										onClick={goToEdit}
										aria-label="Edit"
									>
										<Icon name="pencil" />
										<span className="sm:inline hidden">
											Edit
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

			<Reveal index={1}>
				<div className="mb-6 flex gap-1 border-b border-border">
					<TabButton
						active={tab === 'general'}
						onClick={() => setTab('general')}
					>
						General
					</TabButton>
					<TabButton
						active={tab === 'messages'}
						onClick={() => setTab('messages')}
					>
						Messages
						{chat ? ` (${chat.messages_count})` : ''}
					</TabButton>
				</div>

				<AnimatePresence mode="wait" initial={false}>
					<PageTransition key={tab}>
						{tab === 'messages' ? (
							chatId && <ChatMessagesTab chatId={chatId} />
						) : (
							<Card className="max-w-2xl">
								<CardContent className="pt-6">
									{isLoading || !chat ? (
										<div className="space-y-3">
											<Skeleton className="h-6 w-1/2" />
											<Skeleton className="h-5 w-2/3" />
											<Skeleton className="h-5 w-1/3" />
										</div>
									) : (
										<DetailGrid>
											<DetailRow
												label="Participants"
												value={chat.user_list}
											/>
											{chat.user_ids.map((uid, i) => (
												<DetailRow
													key={uid}
													label={`Participant ${i + 1} ID`}
													value={uid}
												/>
											))}
											<DetailRow
												label="Messages"
												value={String(
													chat.messages_count,
												)}
											/>
											<DetailRow
												label="Chat ID"
												value={chat.id}
											/>
											<DetailRow
												label="Created"
												value={formatDateTime(
													chat.created_at,
												)}
											/>
										</DetailGrid>
									)}
								</CardContent>
							</Card>
						)}
					</PageTransition>
				</AnimatePresence>
			</Reveal>

			<ConfirmDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title="Delete chat?"
				description={`The chat between "${chat?.user_list ?? ''}" and its messages will be permanently deleted.`}
				confirmLabel="Delete"
				destructive
				loading={isDeleting}
				onConfirm={handleDelete}
			/>
		</div>
	)
}
