import { useMemo } from 'react'
import { Link } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { ListPage } from '@/components/list/ListPage'
import type { SavedFilter } from '@/types/api'
import { useSavedFiltersPage } from './useSavedFiltersPage'
import { formatDateTime, savedFilterTitle } from './format'

export function SavedFiltersPage() {
	const {
		search,
		setSearch,
		data,
		isLoading,
		isFetching,
		pagination,
		openSavedFilter,
		goToCreate,
	} = useSavedFiltersPage()

	const columns = useMemo<ColumnDef<SavedFilter, unknown>[]>(
		() => [
			{
				accessorKey: 'title',
				header: 'Title',
				cell: ({ row }) => (
					<span className="font-medium">
						{savedFilterTitle(row.original.title)}
					</span>
				),
			},
			{
				accessorKey: 'user_email',
				header: 'Agent',
				cell: ({ row }) => {
					const { user_id, user_email } = row.original
					return (
						<Link
							to={`/agents/${user_id}`}
							className="link"
							onClick={(e) => e.stopPropagation()}
						>
							{user_email}
						</Link>
					)
				},
			},
			{
				accessorKey: 'value',
				header: 'Value',
				cell: ({ row }) => (
					<span className="block max-w-md truncate font-mono text-xs text-muted-foreground">
						{row.original.value}
					</span>
				),
			},
			{
				accessorKey: 'created_at',
				header: 'Created At',
				cell: ({ row }) => (
					<span className="whitespace-nowrap text-muted-foreground">
						{formatDateTime(row.original.created_at)}
					</span>
				),
			},
		],
		[],
	)

	return (
		<ListPage
			title="Saved Filters"
			description="Agents' saved property searches"
			actions={
				<Button onClick={goToCreate}>
					<Icon name="plus" />
					Add
				</Button>
			}
			search={search}
			onSearchChange={setSearch}
			searchPlaceholder="Search by title or agent…"
			pagination={pagination}
			data={data}
			isLoading={isLoading}
			isFetching={isFetching}
			columns={columns}
			emptyMessage="No saved filters found"
			minWidth="900px"
			onRowClick={(f) => openSavedFilter(f.id)}
		/>
	)
}
