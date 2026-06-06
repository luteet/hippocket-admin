import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { DetailGrid, DetailRow } from '@/components/DetailList'
import { useStatusDetailPage } from './useStatusDetailPage'

export function StatusDetailPage() {
	const {
		status,
		isLoading,
		confirmOpen,
		setConfirmOpen,
		isDeleting,
		handleDelete,
		goBack,
		goToEdit,
	} = useStatusDetailPage()

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title="Status"
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
							{status && (
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
					{isLoading ? (
						<div className="space-y-3">
							<Skeleton className="h-6 w-1/2" />
							<Skeleton className="h-5 w-2/3" />
							<Skeleton className="h-5 w-1/3" />
						</div>
					) : !status ? (
						<p className="text-muted-foreground">
							Status not found
						</p>
					) : (
						<Reveal index={1}>
							<div className="space-y-4">
								<div>
									<p className="text-xl font-semibold">
										{status.name}
									</p>
									<p className="pt-2 text-sm font-medium text-muted-foreground">
										{status.label}
									</p>
								</div>

								<Separator className="mt-8" />

								<DetailGrid className="mt-8">
									<DetailRow
										label="Name"
										value={status.name}
									/>
									<DetailRow
										label="Label"
										value={status.label}
									/>
									<DetailRow
										label="Priority"
										value={String(status.priority)}
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
				title="Delete status?"
				description={`Status "${status?.name ?? ''}" will be permanently deleted.`}
				confirmLabel="Delete"
				destructive
				loading={isDeleting}
				onConfirm={handleDelete}
			/>
		</div>
	)
}
