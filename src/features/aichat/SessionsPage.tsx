import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

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
import type { AiSession } from '@/types/api'
import { useSessionsPage } from './useSessionsPage'
import { formatDateTime } from './format'

export function SessionsPage() {
	const {
		search,
		setSearch,
		data,
		isLoading,
		isFetching,
		pagination,
		goToCreate,
		openSession,
	} = useSessionsPage()

	const columns = useMemo<ColumnDef<AiSession, unknown>[]>(
		() => [
			{ accessorKey: 'user_email', header: 'User' },
			{
				accessorKey: 'messages_count',
				header: 'Messages',
				cell: ({ row }) => (
					<Badge variant="outline">
						{row.original.messages_count}
					</Badge>
				),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{formatDateTime(row.original.created_at)}
					</span>
				),
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{formatDateTime(row.original.updated_at)}
					</span>
				),
			},
		],
		[],
	)

	return (
		<div>
			<PageHeader
				title="AI Chat Sessions"
				description="Conversations between agents and the AI assistant"
				actions={
					<Button onClick={goToCreate}>
						<Icon name="plus" />
						Add
					</Button>
				}
			/>

			<div className="mb-4 flex flex-wrap gap-3 flex-col sm:items-center sm:flex-row">
				<div className="relative sm:max-w-xs flex-1 min-w-40">
					<Icon
						name="search"
						className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
					/>
					<Input
						placeholder="Search sessions…"
						className="pl-9"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<Select
					value={String(pagination.count)}
					onValueChange={(v) => pagination.setCount(Number(v))}
				>
					<SelectTrigger className="ml-auto sm:w-36">
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
				emptyMessage="No sessions found"
				minWidth="700px"
				skeletonRows={pagination.count}
				onRowClick={(s) => openSession(s.id)}
				pagination={{
					page: pagination.page,
					pageCount: pagination.pageCount(data?.total ?? 0),
					onPageChange: pagination.goTo,
				}}
			/>
		</div>
	)
}
