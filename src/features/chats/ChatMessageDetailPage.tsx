import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { DetailGrid, DetailRow } from '@/components/DetailList'
import { useChatMessageDetailPage } from './useChatMessageDetailPage'
import { formatDateTime } from './format'
import { ReadBadge } from './components/ReadBadge'
import { MediaFileLink } from './components/MediaFileLink'

export function ChatMessageDetailPage() {
	const {
		message,
		isLoading,
		confirmOpen,
		setConfirmOpen,
		isDeleting,
		handleDelete,
		goBack,
		goToEdit,
		goToChat,
	} = useChatMessageDetailPage()

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title="Chat Message"
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
							{message && (
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

			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					{isLoading || !message ? (
						<div className="space-y-3">
							<Skeleton className="h-6 w-1/2" />
							<Skeleton className="h-5 w-2/3" />
							<Skeleton className="h-20 w-full" />
						</div>
					) : (
						<Reveal index={1}>
							<div className="space-y-4">
								<div className="flex items-center justify-between gap-4">
									<span className="text-sm font-medium">
										{message.user_email}
									</span>
									<ReadBadge isRead={message.is_read} />
								</div>

								<Separator className="mt-6" />

								<DetailGrid className="mt-6">
									<DetailRow
										label="Author"
										value={message.user_email}
									/>
									<DetailRow label="Chat">
										<button
											type="button"
											onClick={goToChat}
											className="text-left text-primary underline-offset-2 hover:underline"
										>
											Open chat
										</button>
									</DetailRow>
									<DetailRow
										label="Created"
										value={formatDateTime(
											message.created_at,
										)}
									/>
									<DetailRow
										label="Message ID"
										value={message.id}
									/>
								</DetailGrid>

								<div>
									<p className="text-xs text-muted-foreground">
										Text
									</p>
									<pre className="mt-2 max-h-96 overflow-auto rounded-md border border-border bg-muted/40 p-3 text-sm whitespace-pre-wrap wrap-break-word font-sans">
										{message.text || '—'}
									</pre>
								</div>

								{message.files.length > 0 && (
									<div>
										<p className="text-xs text-muted-foreground">
											Files
										</p>
										<ul className="mt-2 space-y-1">
											{message.files.map((file) => (
												<li key={file}>
													<MediaFileLink
														file={file}
													/>
												</li>
											))}
										</ul>
									</div>
								)}
							</div>
						</Reveal>
					)}
				</CardContent>
			</Card>

			<ConfirmDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title="Delete message?"
				description="This message will be permanently deleted."
				confirmLabel="Delete"
				destructive
				loading={isDeleting}
				onConfirm={handleDelete}
			/>
		</div>
	)
}
