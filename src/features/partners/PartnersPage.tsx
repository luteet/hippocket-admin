import { useMemo } from 'react'
import { Link } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { ListPage } from '@/components/list/ListPage'
import { ListPageProvider } from '@/components/list/ListPageContext'
import { EmptyState } from '@/components/EmptyState'
import { BulkActionBar, type BulkAction } from '@/components/list/BulkActionBar'
import type { Partner } from '@/types/api'
import { usePartnersPage, stopRowClick } from './usePartnersPage'
import { NumberCell } from './components/NumberCell'

export function PartnersPage() {
	const {
		goToCreate,
		hasFilters,
		clearFilters,
		getCell,
		setCell,
		saveField,
		selectedIds,
		setSelectedIds,
		clearSelection,
		selectedCount,
		isBulkRunning,
		bulkHide,
		bulkShow,
		bulkDelete,
		...listCtx
	} = usePartnersPage()

	const plural = selectedCount === 1 ? '' : 's'
	const bulkActions: BulkAction[] = [
		{ label: 'Hide', onRun: bulkHide },
		{ label: 'Show', onRun: bulkShow },
		{
			label: 'Delete',
			icon: 'trash-2',
			destructive: true,
			confirm: {
				title: `Delete ${selectedCount} partner${plural}?`,
				description: 'This permanently removes the selected partners.',
				confirmLabel: 'Delete',
			},
			onRun: bulkDelete,
		},
	]

	const emptyState = hasFilters ? (
		<EmptyState
			icon="search-x"
			title="No results"
			description="No partners match your current search."
			action={
				<Button variant="secondary" size="sm" onClick={clearFilters}>
					Clear search
				</Button>
			}
		/>
	) : (
		<EmptyState
			icon="inbox"
			title="No partners yet"
			description="Create the first partner to get started."
			action={
				<Button size="sm" onClick={goToCreate}>
					<Icon name="plus" />
					Add partner
				</Button>
			}
		/>
	)

	const columns = useMemo<ColumnDef<Partner, unknown>[]>(
		() => [
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
						saveField={saveField}
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
							onValueChange={(v) => {
								// Show it instantly, then persist the change.
								setCell(row.original, 'value_type', v)
								saveField(row.original, 'value_type', v)
							}}
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
						saveField={saveField}
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
						saveField={saveField}
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
						saveField={saveField}
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
		<ListPageProvider value={listCtx}>
			<ListPage
				title="Partners"
				description="Manage partners and their fees"
				actions={
					<Button onClick={goToCreate}>
						<Icon name="plus" />
						Add
					</Button>
				}
				searchPlaceholder="Search partners…"
				columns={columns}
				emptyMessage={emptyState}
				minWidth="1800px"
				selection={{
					getRowId: (p) => p.id,
					selectedIds,
					onSelectionChange: setSelectedIds,
				}}
				className={selectedCount > 0 ? 'pb-24' : undefined}
				footer={
					<BulkActionBar
						count={selectedCount}
						actions={bulkActions}
						onClear={clearSelection}
						isRunning={isBulkRunning}
					/>
				}
			/>
		</ListPageProvider>
	)
}
