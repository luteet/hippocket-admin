import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { MediaThumbnail } from '@/components/media/MediaThumbnail'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { PartnerReviewDialog } from './PartnerReviewDialog'
import { usePartnerReviewsTab } from './usePartnerReviewsTab'
import { formatDateTime } from './format'

interface Props {
	partnerId: string
}

export function PartnerReviewsTab({ partnerId }: Props) {
	const {
		reviews,
		isLoading,
		dialogOpen,
		setDialogOpen,
		editing,
		openCreate,
		openEdit,
		pendingDelete,
		setPendingDelete,
		isDeleting,
		handleDelete,
	} = usePartnerReviewsTab(partnerId)

	return (
		<div className="max-w-2xl space-y-4">
			{isLoading ? (
				<div className="space-y-3">
					<Skeleton className="h-24 w-full" />
					<Skeleton className="h-24 w-full" />
				</div>
			) : !reviews?.length ? (
				<Card>
					<CardContent className="py-10 text-center text-sm text-muted-foreground">
						No reviews yet
					</CardContent>
				</Card>
			) : (
				<div className="space-y-3">
					{reviews.map((review) => (
						<Card key={review.id}>
							<CardContent className="flex items-start gap-4 p-6">
								<MediaThumbnail
									url={review.avatar_url}
									shape="circle"
									placeholderIcon="user"
									className="size-10"
								/>
								<div className="min-w-0 flex-1 space-y-1">
									<p className="font-medium">{review.name}</p>
									<p className="pt-2 text-sm wrap-break-word whitespace-pre-line text-muted-foreground">
										{review.text}
									</p>
									<p className="pt-4 text-xs text-muted-foreground">
										{formatDateTime(review.created_at)}
									</p>
								</div>
								<div className="flex shrink-0 gap-1">
									<Button
										variant="ghost"
										size="icon"
										title="Edit review"
										onClick={() => openEdit(review)}
									>
										<Icon name="pencil" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										title="Delete review"
										onClick={() => setPendingDelete(review)}
									>
										<Icon name="trash-2" />
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{dialogOpen && (
				<PartnerReviewDialog
					partnerId={partnerId}
					review={editing}
					open={dialogOpen}
					onOpenChange={setDialogOpen}
				/>
			)}

			<ConfirmDialog
				open={!!pendingDelete}
				onOpenChange={(open) => !open && setPendingDelete(null)}
				title="Delete review?"
				description={`Review by "${pendingDelete?.name ?? ''}" will be permanently deleted.`}
				confirmLabel="Delete"
				destructive
				loading={isDeleting}
				onConfirm={handleDelete}
			/>

			<div className="flex justify-end">
				<Button onClick={openCreate}>
					<Icon name="plus" />
					Add review
				</Button>
			</div>
		</div>
	)
}
