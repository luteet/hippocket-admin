import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { PAGE_SIZE_OPTIONS } from '@/hooks/usePagination'
import type { AiMessage } from '@/types/api'
import { useMessagesPage, ALL, ROLE_OPTIONS } from './useMessagesPage'
import { formatDateTime, previewContent } from './format'
import { RoleBadge } from './components/RoleBadge'
import { SessionSelect } from './components/SessionSelect'

export function MessagesPage() {
	const {
		search,
		setSearch,
		role,
		setRole,
		sessionId,
		setSessionId,
		sessionRefs,
		sessionsLoading,
		data,
		isLoading,
		isFetching,
		pagination,
		goToCreate,
		openMessage,
	} = useMessagesPage()

	const columns = useMemo<ColumnDef<AiMessage, unknown>[]>(
		() => [
			{
				accessorKey: 'session_user_email',
				header: 'User',
			},
			{
				accessorKey: 'role',
				header: 'Role',
				cell: ({ row }) => <RoleBadge role={row.original.role} />,
			},
			{
				accessorKey: 'content',
				header: 'Content',
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{previewContent(row.original.content) || '—'}
					</span>
				),
				meta: { className: 'max-w-md' },
			},
			{
				accessorKey: 'is_visible',
				header: 'Visible',
				cell: ({ row }) =>
					row.original.is_visible ? (
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
				header: 'Created',
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{formatDateTime(row.original.created_at)}
					</span>
				),
			},
		],
		[],
	)

	return (
		<div>
			<PageHeader
				title="AI Chat Messages"
				description="Individual messages exchanged with the AI assistant"
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
						placeholder="Search messages…"
						className="pl-9"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<Select value={role} onValueChange={setRole}>
					<SelectTrigger className="sm:w-36">
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

				<div className="sm:w-64">
					<SessionSelect
						value={sessionId}
						options={sessionRefs}
						loading={sessionsLoading}
						onChange={setSessionId}
						allOption={{ value: ALL, label: 'All sessions' }}
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
				emptyMessage="No messages found"
				minWidth="900px"
				skeletonRows={pagination.count}
				onRowClick={(m) => openMessage(m.id)}
				pagination={{
					page: pagination.page,
					pageCount: pagination.pageCount(data?.total ?? 0),
					onPageChange: pagination.goTo,
				}}
			/>
		</div>
	)
}
