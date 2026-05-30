import * as React from 'react'
import { useNavigate } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Search } from 'lucide-react'

import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { usePagination } from '@/hooks/usePagination'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { Partner } from '@/types/api'
import { usePartners } from './hooks'
import { formatFee } from './format'

export function PartnersPage() {
	const navigate = useNavigate()
	const [search, setSearch] = React.useState('')
	const debouncedSearch = useDebouncedValue(search)
	const pagination = usePagination({ count: 20 })

	// Reset to the first page when the search query changes.
	React.useEffect(() => {
		pagination.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch])

	const { data, isLoading, isFetching } = usePartners({
		offset: pagination.offset,
		count: pagination.count,
		search: debouncedSearch || undefined,
	})

	const columns = React.useMemo<ColumnDef<Partner, unknown>[]>(
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
					<Button onClick={() => navigate('/partners/new')}>
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
				data={data ?? []}
				isLoading={isLoading || isFetching}
				emptyMessage="No partners found"
				onRowClick={(p) => navigate(`/partners/${p.id}`)}
				pagination={{
					page: pagination.page,
					hasPrev: pagination.hasPrev,
					hasNext: pagination.canNext(data?.length ?? 0),
					onPrev: pagination.prev,
					onNext: pagination.next,
				}}
			/>
		</div>
	)
}
