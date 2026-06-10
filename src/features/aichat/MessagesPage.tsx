import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { TimeAgo } from '@/components/TimeAgo'
import { ListPage } from '@/components/list/ListPage'
import { FiltersPopover } from '@/components/list/FiltersPopover'
import { FilterSelect } from '@/components/list/FilterSelect'
import type { AiMessage } from '@/types/api'
import { useMessagesPage, ALL, ROLE_OPTIONS } from './useMessagesPage'
import { previewContent } from './format'
import { RoleBadge } from './components/RoleBadge'
import { SessionFilter } from './components/SessionFilter'

export function MessagesPage() {
	const {
		search,
		setSearch,
		role,
		setRole,
		sessionId,
		setSessionId,
		activeFilterCount,
		clearFilters,
		sessionRefs,
		sessionsLoading,
		data,
		isLoading,
		isFetching,
		pagination,
		sorting,
		goToCreate,
		openMessage,
	} = useMessagesPage()

	const columns = useMemo<ColumnDef<AiMessage, unknown>[]>(
		() => [
			{
				accessorKey: 'session_user_email',
				header: 'User',
				meta: { sortKey: 'session_user_email', className: 'w-64' },
			},
			{
				accessorKey: 'role',
				header: 'Role',
				meta: { sortKey: 'role', className: 'w-32' },
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
				meta: { sortKey: 'content', className: 'w-72' },
			},
			{
				accessorKey: 'is_visible',
				header: 'Visible',
				meta: { sortKey: 'is_visible', className: 'w-28' },
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
				meta: { sortKey: 'created_at', className: 'w-40' },
				cell: ({ row }) => (
					<TimeAgo
						value={row.original.created_at}
						className="text-muted-foreground"
					/>
				),
			},
		],
		[],
	)

	return (
		<ListPage
			title="AI Chat Messages"
			description="Individual messages exchanged with the AI assistant"
			actions={
				<Button onClick={goToCreate}>
					<Icon name="plus" />
					Add
				</Button>
			}
			search={search}
			onSearchChange={setSearch}
			searchPlaceholder="Search messages…"
			filters={
				<FiltersPopover
					activeCount={activeFilterCount}
					onClear={clearFilters}
				>
					<FilterSelect
						label="Role"
						value={role}
						onChange={setRole}
						options={ROLE_OPTIONS}
						allOption={{ value: ALL, label: 'All roles' }}
					/>
					<SessionFilter
						value={sessionId}
						options={sessionRefs}
						loading={sessionsLoading}
						onChange={setSessionId}
					/>
				</FiltersPopover>
			}
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
			emptyMessage="No messages found"
			minWidth="900px"
			onRowClick={(m) => openMessage(m.id)}
		/>
	)
}
