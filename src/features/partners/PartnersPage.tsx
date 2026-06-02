import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Search } from 'lucide-react'

import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import type { Partner } from '@/types/api'
import { usePartnersPage } from './usePartnersPage'
import { formatFee } from './format'

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
	} = usePartnersPage()

	const columns = useMemo<ColumnDef<Partner, unknown>[]>(
		() => [
			{ accessorKey: 'name', header: 'Name' },
			{ accessorKey: 'email', header: 'Email' },
			{ accessorKey: 'phone', header: 'Phone' },
			{
				id: 'fee',
				header: 'Fee',
				cell: ({ row }) => formatFee(row.original),
			},
			{
				id: 'status',
				header: 'Status',
				cell: ({ row }) =>
					row.original.is_hide ? (
						<Badge variant="muted">Hidden</Badge>
					) : (
						<Badge variant="success">Active</Badge>
					),
			},
		],
		[],
	)

	return (
		<div>
			<PageHeader
				title="Partners"
				description="Manage partners and their fees"
				actions={
					<Button onClick={goToCreate}>
						<Plus />
						Add
					</Button>
				}
			/>

			<div className="relative mb-4 max-w-sm">
				<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					placeholder="Search partners…"
					className="pl-9"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>

			<DataTable
				columns={columns}
				data={data?.items ?? []}
				isLoading={isLoading || isFetching}
				emptyMessage="No partners found"
				onRowClick={(p) => openPartner(p.id)}
				pagination={{
					page: pagination.page,
					hasPrev: pagination.hasPrev,
					hasNext: pagination.canNext(data?.items.length ?? 0),
					onPrev: pagination.prev,
					onNext: pagination.next,
				}}
			/>
		</div>
	)
}
