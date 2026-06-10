import { useMemo } from 'react'
import { Link } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { AnimatePresence, motion } from 'motion/react'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { ListPage } from '@/components/list/ListPage'
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
		sorting,
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
				meta: { className: 'w-14' },
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
									<Tooltip content="Save changes">
										<Button
											size="icon"
											className="size-7"
											disabled={isRowSaving(
												row.original.id,
											)}
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
									</Tooltip>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				),
			},
			{
				accessorKey: 'name',
				header: 'Name',
				meta: { sortKey: 'name', className: 'w-52' },
				cell: ({ row }) => (
					<div className="w-45 wrap-break-word whitespace-normal">
						{row.original.name}
					</div>
				),
			},
			{
				accessorKey: 'subtitle',
				header: 'Subtitle',
				meta: { sortKey: 'subtitle', className: 'w-56' },
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
				meta: { sortKey: 'potential_value', className: 'w-40' },
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
				meta: { sortKey: 'value_type', className: 'w-40' },
				// The dropdown is portalled to <body>, but React events bubble
				// through the component tree, so an option click would reach the
				// row's onClick (→ openPartner). Stop it on a wrapper that sits
				// above both the trigger and the portalled content in that tree.
				cell: ({ row }) => (
					<div onMouseDown={stopRowClick} onClick={stopRowClick}>
						<Select
							value={getCell(row.original, 'value_type')}
							onValueChange={(v) =>
								setCell(row.original, 'value_type', v)
							}
						>
							<SelectTrigger className="h-9 w-28">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="money">Money</SelectItem>
								<SelectItem value="tokens">Tokens</SelectItem>
							</SelectContent>
						</Select>
					</div>
				),
			},
			{
				accessorKey: 'agent_fee',
				header: 'Agent Fee ($)',
				meta: { sortKey: 'agent_fee', className: 'w-44' },
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
				meta: { sortKey: 'group_owner_fee', className: 'w-48' },
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
				meta: { sortKey: 'hippocket_fee', className: 'w-48' },
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
				meta: { sortKey: 'chosen_group_name', className: 'w-44' },
				cell: ({ row }) => {
					const { chosen_group_id, chosen_group_name } = row.original
					if (!chosen_group_id)
						return <span className="text-muted-foreground">—</span>
					return (
						<Link
							to={`/groups/${chosen_group_id}`}
							onClick={stopRowClick}
						>
							<Badge
								variant="outline"
								className="hover:border-primary"
							>
								{chosen_group_name}
							</Badge>
						</Link>
					)
				},
			},
		],
		// The hook returns referentially-stable callbacks, so the columns (and
		// thus the inline inputs) never need to be rebuilt — preserving focus.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	)

	return (
		<ListPage
			title="Partners"
			description="Manage partners and their fees"
			actions={
				<Button onClick={goToCreate}>
					<Icon name="plus" />
					Add
				</Button>
			}
			search={search}
			onSearchChange={setSearch}
			searchPlaceholder="Search partners…"
			pagination={pagination}
			data={data}
			isLoading={isLoading}
			isFetching={isFetching}
			columns={columns}
			sorting={{
				sortBy: sorting.sortBy,
				order: sorting.order,
				onToggle: sorting.toggle,
			}}
			emptyMessage="No partners found"
			minWidth="1800px"
			onRowClick={(p) => openPartner(p.id)}
			className={isDirty ? 'pb-24' : undefined}
			footer={
				<AnimatePresence>
					{isDirty && (
						<motion.div
							initial={{ opacity: 0, x: '-50%', y: 24 }}
							animate={{ opacity: 1, x: '-50%', y: 0 }}
							exit={{ opacity: 0, x: '-50%', y: 24 }}
							transition={{ duration: 0.2, ease: 'easeOut' }}
							className="fixed bottom-6 left-1/2 z-50"
						>
							<div className="flex flex-col items-center gap-4 min-w-70 rounded-2xl border border-border bg-card px-5 py-3 shadow-lg sm:flex-row">
								<span className="text-sm text-muted-foreground">
									{dirtyCount} partner
									{dirtyCount > 1 ? 's' : ''} changed
								</span>
								<div className="flex gap-4 w-full sm:w-auto">
									<Button
										variant="outline"
										size="sm"
										className="flex-auto text-sm"
										onClick={discard}
										disabled={isSaving}
									>
										Discard
									</Button>
									<Button
										size="sm"
										className="flex-auto text-sm"
										onClick={handleSaveAll}
										disabled={isSaving}
									>
										{isSaving ? 'Saving…' : 'Save All'}
									</Button>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			}
		/>
	)
}
