import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { DetailGrid, DetailRow } from '@/components/DetailList'
import { useMessageDetailPage } from './useMessageDetailPage'
import { formatDateTime } from './format'
import { RoleBadge } from './components/RoleBadge'

export function MessageDetailPage() {
	const {
		message,
		isLoading,
		confirmOpen,
		setConfirmOpen,
		isDeleting,
		handleDelete,
		goBack,
		goToEdit,
		goToSession,
	} = useMessageDetailPage()

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title="AI Chat Message"
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
									<RoleBadge role={message.role} />
									{message.is_visible ? (
										<Badge variant="success">Visible</Badge>
									) : (
										<Badge variant="muted">Hidden</Badge>
									)}
								</div>

								<Separator className="mt-6" />

								<DetailGrid className="mt-6">
									<DetailRow
										label="User"
										value={message.session_user_email}
									/>
									<DetailRow label="Session">
										<button
											type="button"
											onClick={goToSession}
											className="text-left text-primary underline-offset-2 hover:underline"
										>
											Open session
										</button>
									</DetailRow>
									<DetailRow
										label="Function name"
										value={message.function_name}
									/>
									<DetailRow
										label="Function call ID"
										value={message.function_call_id}
									/>
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
										Content
									</p>
									<pre className="mt-2 max-h-96 overflow-auto rounded-md border border-border bg-muted/40 p-3 text-sm whitespace-pre-wrap wrap-break-word font-sans">
										{message.content || '—'}
									</pre>
								</div>

								{message.data != null && (
									<div>
										<p className="text-xs text-muted-foreground">
											Data
										</p>
										<pre className="mt-2 max-h-96 overflow-auto rounded-md border border-border bg-muted/40 p-3 text-xs whitespace-pre-wrap wrap-break-word">
											{JSON.stringify(
												message.data,
												null,
												2,
											)}
										</pre>
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
