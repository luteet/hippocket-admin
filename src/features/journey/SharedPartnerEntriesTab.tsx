import { useMemo } from 'react'
import { Link } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/DataTable'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import type { SharedPartnerEntry } from '@/types/api'
import { SharedPartnerEntryDialog } from './SharedPartnerEntryDialog'
import {
	stopRowClick,
	useSharedPartnerEntriesTab,
} from './useSharedPartnerEntriesTab'

interface Props {
	sharedId: string
	entries: SharedPartnerEntry[]
}

export function SharedPartnerEntriesTab({ sharedId, entries }: Props) {
	const {
		dialogOpen,
		setDialogOpen,
		editing,
		openCreate,
		openEdit,
		pendingDelete,
		setPendingDelete,
		isDeleting,
		handleDelete,
	} = useSharedPartnerEntriesTab(sharedId)

	const columns = useMemo<ColumnDef<SharedPartnerEntry, unknown>[]>(
		() => [
			{
				accessorKey: 'partner_name',
				header: 'Partner',
				cell: ({ row }) => (
					<Link
						to={`/partners/${row.original.partner_id}`}
						className="link"
						onClick={stopRowClick}
					>
						{row.original.partner_name}
					</Link>
				),
			},
			{
				accessorKey: 'is_top_rated',
				header: 'Top rated',
				cell: ({ row }) =>
					row.original.is_top_rated ? (
						<Badge variant="outline">Top rated</Badge>
					) : (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'is_recommend',
				header: 'Recommended',
				cell: ({ row }) =>
					row.original.is_recommend ? (
						<Badge variant="outline">Recommended</Badge>
					) : (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				id: 'actions',
				header: '',
				meta: { className: 'w-px text-right' },
				cell: ({ row }) => (
					<div
						className="flex justify-end gap-1"
						onMouseDown={stopRowClick}
						onClick={stopRowClick}
					>
						<Tooltip content="Edit entry">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => openEdit(row.original)}
							>
								<Icon name="pencil" />
							</Button>
						</Tooltip>
						<Tooltip content="Remove entry">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setPendingDelete(row.original)}
							>
								<Icon name="trash-2" />
							</Button>
						</Tooltip>
					</div>
				),
			},
		],
		[openEdit, setPendingDelete],
	)

	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<Button onClick={openCreate}>
					<Icon name="plus" />
					Add partner
				</Button>
			</div>

			<DataTable
				columns={columns}
				data={entries}
				emptyMessage="No partners in this list"
				minWidth="700px"
				onRowClick={(e) => openEdit(e)}
			/>

			{dialogOpen && (
				<SharedPartnerEntryDialog
					sharedId={sharedId}
					entry={editing}
					open={dialogOpen}
					onOpenChange={setDialogOpen}
				/>
			)}

			<ConfirmDialog
				open={!!pendingDelete}
				onOpenChange={(open) => !open && setPendingDelete(null)}
				title="Remove partner?"
				description={`"${pendingDelete?.partner_name ?? ''}" will be removed from this shared list.`}
				confirmLabel="Remove"
				destructive
				loading={isDeleting}
				onConfirm={handleDelete}
			/>
		</div>
	)
}
