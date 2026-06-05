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
import type { Agent } from '@/types/api'
import {
	useAgentsPage,
	ALL,
	ROLE_OPTIONS,
	STATUS_OPTIONS,
	ACTIVE_OPTIONS,
} from './useAgentsPage'

export function AgentsPage() {
	const {
		search,
		setSearch,
		role,
		setRole,
		status,
		setStatus,
		isActive,
		setIsActive,
		data,
		isLoading,
		isFetching,
		pagination,
		goToCreate,
		openAgent,
	} = useAgentsPage()

	const columns = useMemo<ColumnDef<Agent, unknown>[]>(
		() => [
			{ accessorKey: 'email', header: 'Email' },
			{
				accessorKey: 'username',
				header: 'Username',
				cell: ({ row }) =>
					row.original.username || (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'role',
				header: 'Role',
				cell: ({ row }) => (
					<Badge variant="outline" className="capitalize">
						{row.original.role}
					</Badge>
				),
			},
			{
				id: 'groups',
				header: 'Groups',
				cell: ({ row }) => {
					const groups = row.original.group_names
					if (!groups?.length)
						return <span className="text-muted-foreground">—</span>
					return (
						<div className="flex flex-wrap gap-1">
							{groups.map((g) => (
								<Badge key={g} variant="outline">
									{g}
								</Badge>
							))}
						</div>
					)
				},
			},
			{
				accessorKey: 'is_new_user',
				header: 'New User',
				cell: ({ row }) =>
					row.original.is_new_user ? (
						<Icon
							name="circle-check"
							className="size-5 text-emerald-600"
						/>
					) : (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'created_at',
				header: 'Created At',
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{row.original.created_at.slice(0, 16)}
					</span>
				),
			},
		],
		[],
	)

	return (
		<div>
			<PageHeader
				title="Agents"
				description="Browse registered agents"
				actions={
					<Button onClick={goToCreate}>
						<Icon name="plus" />
						Add
					</Button>
				}
			/>

			<div className="mb-4 flex flex-wrap gap-3 flex-col xs2:items-center xs2:flex-row">
				<div className="relative xs2:max-w-xs flex-1">
					<Icon
						name="search"
						className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
					/>
					<Input
						placeholder="Search agents…"
						className="pl-9"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<Select value={role} onValueChange={setRole}>
					<SelectTrigger className="xs2:w-36">
						<SelectValue placeholder="Role" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>All roles</SelectItem>
						{ROLE_OPTIONS.map((o) => (
							<SelectItem key={o.value} value={o.value}>
								{o.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={status} onValueChange={setStatus}>
					<SelectTrigger className="xs2:w-36">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>All statuses</SelectItem>
						{STATUS_OPTIONS.map((o) => (
							<SelectItem key={o.value} value={o.value}>
								{o.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={isActive} onValueChange={setIsActive}>
					<SelectTrigger className="xs2:w-36">
						<SelectValue placeholder="Active" />
					</SelectTrigger>
					<SelectContent>
						{ACTIVE_OPTIONS.map((o) => (
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
				emptyMessage="No agents found"
				minWidth="1000px"
				skeletonRows={pagination.count}
				onRowClick={(a) => openAgent(a.id)}
				pagination={{
					page: pagination.page,
					pageCount: pagination.pageCount(data?.total ?? 0),
					onPageChange: pagination.goTo,
				}}
			/>
		</div>
	)
}
