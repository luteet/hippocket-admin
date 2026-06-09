import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { CashOffersEmailDialog } from './CashOffersEmailDialog'
import { useCashOffersEmailsTab } from './useCashOffersEmailsTab'

interface Props {
	groupId: number | null
	groupName: string | null
}

export function CashOffersEmailsTab({ groupId, groupName }: Props) {
	const {
		emails,
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
	} = useCashOffersEmailsTab(groupId)

	return (
		<div className="max-w-2xl space-y-4">
			<p className="text-sm text-muted-foreground">
				{groupName
					? `Recipients of cash-offer emails for ${groupName}.`
					: 'Recipients of cash-offer emails (all properties).'}
			</p>

			{isLoading ? (
				<div className="space-y-3">
					<Skeleton className="h-16 w-full" />
					<Skeleton className="h-16 w-full" />
				</div>
			) : !emails?.length ? (
				<Card>
					<CardContent className="py-10 text-center text-sm text-muted-foreground">
						No emails yet
					</CardContent>
				</Card>
			) : (
				<div className="space-y-3">
					{emails.map((email) => (
						<Card key={email.id}>
							<CardContent className="flex items-center gap-4 p-4">
								<div className="min-w-0 flex-1">
									<p className="font-medium">{email.name}</p>
									<p className="truncate text-sm text-muted-foreground">
										{email.email}
									</p>
								</div>
								{email.is_active ? (
									<Badge variant="success">Active</Badge>
								) : (
									<Badge variant="muted">Inactive</Badge>
								)}
								<div className="flex shrink-0 gap-1">
									<Button
										variant="ghost"
										size="icon"
										title="Edit email"
										onClick={() => openEdit(email)}
									>
										<Icon name="pencil" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										title="Delete email"
										onClick={() => setPendingDelete(email)}
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
				<CashOffersEmailDialog
					groupId={groupId}
					email={editing}
					open={dialogOpen}
					onOpenChange={setDialogOpen}
				/>
			)}

			<ConfirmDialog
				open={!!pendingDelete}
				onOpenChange={(open) => !open && setPendingDelete(null)}
				title="Delete email?"
				description={`"${pendingDelete?.email ?? ''}" will be permanently deleted.`}
				confirmLabel="Delete"
				destructive
				loading={isDeleting}
				onConfirm={handleDelete}
			/>

			<div className="flex justify-end">
				<Button onClick={openCreate}>
					<Icon name="plus" />
					Add email
				</Button>
			</div>
		</div>
	)
}
