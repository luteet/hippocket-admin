import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/DataTable'
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
import type { Group } from '@/types/api'
import { useGroupsPage, DELETED_OPTIONS } from './useGroupsPage'

export function GroupsPage() {
	const {
		search,
		setSearch,
		deleted,
		setDeleted,
		data,
		isLoading,
		isFetching,
		pagination,
	} = useGroupsPage()

	const columns = useMemo<ColumnDef<Group, unknown>[]>(
		() => [
			{ accessorKey: 'name', header: 'Name' },
			{
				accessorKey: 'slug',
				header: 'Slug',
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{row.original.slug}
					</span>
				),
			},
			{
				accessorKey: 'count_people',
				header: 'People',
				cell: ({ row }) => (
					<span className="tabular-nums">
						{row.original.count_people}
					</span>
				),
			},
			{
				accessorKey: 'is_deleted',
				header: 'Status',
				cell: ({ row }) =>
					row.original.is_deleted ? (
						<Badge variant="destructive">Deleted</Badge>
					) : (
						<Badge variant="success">Active</Badge>
					),
			},
		],
		[],
	)

	return (
		<div>
			<PageHeader title="Groups" description="Browse partner groups" />

			<div className="mb-4 flex flex-wrap gap-3 flex-col xs2:items-center xs2:flex-row">
				<div className="relative xs2:max-w-xs flex-1">
					<Icon
						name="search"
						className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
					/>
					<Input
						placeholder="Search groups…"
						className="pl-9"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<Select value={deleted} onValueChange={setDeleted}>
					<SelectTrigger className="xs2:w-36">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						{DELETED_OPTIONS.map((o) => (
							<SelectItem key={o.value} value={o.value}>
								{o.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={String(pagination.count)}
					onValueChange={(v) => pagination.setCount(Number(v))}
				>
					<SelectTrigger className="ml-auto xs2:w-36">
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
				emptyMessage="No groups found"
				minWidth="600px"
				skeletonRows={pagination.count}
				pagination={{
					page: pagination.page,
					pageCount: pagination.pageCount(data?.total ?? 0),
					onPageChange: pagination.goTo,
				}}
			/>
		</div>
	)
}
