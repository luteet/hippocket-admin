import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { ListPage } from '@/components/list/ListPage'
import { FiltersPopover } from '@/components/list/FiltersPopover'
import { FilterSelect } from '@/components/list/FilterSelect'
import type { AiMessage } from '@/types/api'
import { useMessagesPage, ALL, ROLE_OPTIONS } from './useMessagesPage'
import { formatDateTime, previewContent } from './format'
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
			emptyMessage="No messages found"
			minWidth="900px"
			onRowClick={(m) => openMessage(m.id)}
		/>
	)
}
