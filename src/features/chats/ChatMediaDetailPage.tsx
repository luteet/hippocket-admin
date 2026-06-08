import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { DetailGrid, DetailRow } from '@/components/DetailList'
import { useChatMediaDetailPage } from './useChatMediaDetailPage'
import { formatDateTime, isImage, mediaUrl } from './format'
import { MediaFileLink } from './components/MediaFileLink'

export function ChatMediaDetailPage() {
	const {
		media,
		isLoading,
		confirmOpen,
		setConfirmOpen,
		isDeleting,
		handleDelete,
		goBack,
		goToMessage,
	} = useChatMediaDetailPage()

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title="Chat Media"
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
							{media && (
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
							)}
						</>
					}
				/>
			</Reveal>

			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					{isLoading || !media ? (
						<div className="space-y-3">
							<Skeleton className="h-6 w-1/2" />
							<Skeleton className="h-5 w-2/3" />
							<Skeleton className="h-40 w-full" />
						</div>
					) : (
						<Reveal index={1}>
							<div className="space-y-4">
								{isImage(media.file) && (
									<a
										href={mediaUrl(media.file)}
										target="_blank"
										rel="noreferrer"
									>
										<img
											src={mediaUrl(media.file)}
											alt="Chat media preview"
											className="max-h-80 w-auto rounded-md border border-border object-contain"
										/>
									</a>
								)}

								<DetailGrid>
									<DetailRow label="File">
										<MediaFileLink file={media.file} />
									</DetailRow>
									<DetailRow
										label="Uploaded by"
										value={media.user_email}
									/>
									<DetailRow label="Message">
										{media.message_id ? (
											<button
												type="button"
												onClick={goToMessage}
												className="text-left text-primary underline-offset-2 hover:underline"
											>
												Open message
											</button>
										) : (
											'—'
										)}
									</DetailRow>
									<DetailRow
										label="Media ID"
										value={media.id}
									/>
									<DetailRow
										label="Created"
										value={formatDateTime(media.created_at)}
									/>
								</DetailGrid>
							</div>
						</Reveal>
					)}
				</CardContent>
			</Card>

			<ConfirmDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title="Delete media?"
				description="This file will be permanently deleted."
				confirmLabel="Delete"
				destructive
				loading={isDeleting}
				onConfirm={handleDelete}
			/>
		</div>
	)
}
