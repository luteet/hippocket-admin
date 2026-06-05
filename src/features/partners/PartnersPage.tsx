import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { AnimatePresence, motion } from 'motion/react'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { PAGE_SIZE_OPTIONS } from '@/hooks/usePagination'
import type { Partner } from '@/types/api'
import { usePartnersPage, stopRowClick } from './usePartnersPage'
import { NumberCell } from './components/NumberCell'

export function PartnersPage() {
	const {
		search,
		setSearch,
		data,
		isLoading,
		isFetching,
		pagination,
		goToCreate,
		openPartner,
		getCell,
		setCell,
		isDirty,
		dirtyCount,
		isSaving,
		isRowDirty,
		isRowSaving,
		handleSaveRow,
		handleSaveAll,
		discard,
	} = usePartnersPage()

	const columns = useMemo<ColumnDef<Partner, unknown>[]>(
		() => [
			{
				id: 'rowSave',
				header: () => <div className="w-7" />,
				cell: ({ row }) => (
					<div className="w-7">
						<AnimatePresence>
							{isRowDirty(row.original.id) && (
								<motion.div
									initial={{ opacity: 0, scale: 0.6 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.6 }}
									transition={{ duration: 0.15 }}
								>
									<Button
										size="icon"
										className="size-7"
										title="Save changes"
										disabled={isRowSaving(row.original.id)}
										onClick={(e) => {
											stopRowClick(e)
											handleSaveRow(row.original.id)
										}}
									>
										{isRowSaving(row.original.id) ? (
											<Icon
												name="loader"
												className="animate-spin"
											/>
										) : (
											<Icon name="check" />
										)}
									</Button>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				),
			},
			{
				accessorKey: 'name',
				header: 'Name',
				cell: ({ row }) => (
					<div className="w-45 wrap-break-word whitespace-normal">
						{row.original.name}
					</div>
				),
			},
			{
				accessorKey: 'subtitle',
				header: 'Subtitle',
				cell: ({ row }) => (
					<div className="w-50 wrap-break-word whitespace-normal">
						{row.original.subtitle || (
							<span className="text-muted-foreground">—</span>
						)}
					</div>
				),
			},
			{
				accessorKey: 'potential_value',
				header: 'Potential value',
				cell: ({ row }) => (
					<NumberCell
						partner={row.original}
						field="potential_value"
						getCell={getCell}
						setCell={setCell}
					/>
				),
			},
			{
				accessorKey: 'value_type',
				header: 'Value type',
				cell: ({ row }) => (
					<Select
						value={getCell(row.original, 'value_type')}
						onValueChange={(v) =>
							setCell(row.original, 'value_type', v)
						}
					>
						<SelectTrigger
							className="h-9 w-28"
							onClick={stopRowClick}
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="money">Money</SelectItem>
							<SelectItem value="tokens">Tokens</SelectItem>
						</SelectContent>
					</Select>
				),
			},
			{
				accessorKey: 'agent_fee',
				header: 'Agent Fee ($)',
				cell: ({ row }) => (
					<NumberCell
						partner={row.original}
						field="agent_fee"
						getCell={getCell}
						setCell={setCell}
					/>
				),
			},
			{
				accessorKey: 'group_owner_fee',
				header: 'Group Owner Fee ($)',
				cell: ({ row }) => (
					<NumberCell
						partner={row.original}
						field="group_owner_fee"
						getCell={getCell}
						setCell={setCell}
					/>
				),
			},
			{
				accessorKey: 'hippocket_fee',
				header: 'Hippocket Fee ($)',
				cell: ({ row }) => (
					<NumberCell
						partner={row.original}
						field="hippocket_fee"
						getCell={getCell}
						setCell={setCell}
					/>
				),
			},
			{
				accessorKey: 'chosen_group_name',
				header: 'Group',
				cell: ({ row }) => (
					<Badge variant="outline">
						{row.original.chosen_group_name}
					</Badge>
				),
			},
		],
		// The hook returns referentially-stable callbacks, so the columns (and
		// thus the inline inputs) never need to be rebuilt — preserving focus.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	)

	return (
		<div className={isDirty ? 'pb-24' : undefined}>
			<PageHeader
				title="Partners"
				description="Manage partners and their fees"
				actions={
					<Button onClick={goToCreate}>
						<Icon name="plus" />
						Add
					</Button>
				}
			/>

			<div className="mb-4 flex flex-wrap gap-3 flex-col sm:items-center sm:flex-row">
				<div className="relative sm:max-w-sm flex-1">
					<Icon
						name="search"
						className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
					/>
					<Input
						placeholder="Search partners…"
						className="pl-9"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<Select
					value={String(pagination.count)}
					onValueChange={(v) => pagination.setCount(Number(v))}
				>
					<SelectTrigger className="ml-auto sm:w-40">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{PAGE_SIZE_OPTIONS.map((n) => (
							<SelectItem key={n} value={String(n)}>
								{n} per page
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<DataTable
				columns={columns}
				data={data?.items ?? []}
				isLoading={isLoading || isFetching}
				emptyMessage="No partners found"
				minWidth="1800px"
				skeletonRows={pagination.count}
				onRowClick={(p) => openPartner(p.id)}
				pagination={{
					page: pagination.page,
					pageCount: pagination.pageCount(data?.total ?? 0),
					onPageChange: pagination.goTo,
				}}
			/>

			<AnimatePresence>
				{isDirty && (
					<motion.div
						initial={{ opacity: 0, x: '-50%', y: 24 }}
						animate={{ opacity: 1, x: '-50%', y: 0 }}
						exit={{ opacity: 0, x: '-50%', y: 24 }}
						transition={{ duration: 0.2, ease: 'easeOut' }}
						className="fixed bottom-6 left-1/2 z-50"
					>
						<div className="flex items-center gap-4 rounded-full border border-border bg-card px-5 py-3 shadow-lg">
							<span className="text-sm text-muted-foreground">
								{dirtyCount} partner
								{dirtyCount > 1 ? 's' : ''} changed
							</span>
							<Button
								variant="outline"
								size="sm"
								onClick={discard}
								disabled={isSaving}
							>
								Discard
							</Button>
							<Button
								size="sm"
								onClick={handleSaveAll}
								disabled={isSaving}
							>
								{isSaving ? 'Saving…' : 'Save All'}
							</Button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
