import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { DetailGrid, DetailRow } from '@/components/DetailList'
import { useReferenceDetailPage } from './useReferenceDetailPage'
import type { ReferenceKind } from './useReferenceListPage'

export function ReferenceDetailPage({ kind }: { kind: ReferenceKind }) {
	const {
		config,
		item,
		isLoading,
		confirmOpen,
		setConfirmOpen,
		isDeleting,
		handleDelete,
		goBack,
		goToEdit,
	} = useReferenceDetailPage(kind)

	return (
		<div>
			<PageHeader
				title={config.singular}
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
						{item && (
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

			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					{isLoading ? (
						<div className="space-y-3">
							<Skeleton className="h-6 w-1/2" />
							<Skeleton className="h-5 w-2/3" />
							<Skeleton className="h-5 w-1/3" />
						</div>
					) : !item ? (
						<p className="text-muted-foreground">
							{config.singular} not found
						</p>
					) : (
						<div className="space-y-4">
							<div>
								<p className="text-xl font-semibold">
									{item.name}
								</p>
							</div>

							<Separator className="mt-8" />

							<DetailGrid className="mt-8">
								<DetailRow label="Name" value={item.name} />
								<DetailRow
									label="Sort"
									value={String(item.sort)}
								/>
								{config.hasContent && (
									<>
										<DetailRow
											label="Description"
											value={item.description}
										/>
										<DetailRow
											label="Keywords"
											value={item.keywords}
										/>
									</>
								)}
							</DetailGrid>
						</div>
					)}
				</CardContent>
			</Card>

			<ConfirmDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title={`Delete ${config.singular.toLowerCase()}?`}
				description={`${config.singular} "${item?.name ?? ''}" will be permanently deleted.`}
				confirmLabel="Delete"
				destructive
				loading={isDeleting}
				onConfirm={handleDelete}
			/>
		</div>
	)
}
