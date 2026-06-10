import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { TimeAgo } from '@/components/TimeAgo'
import { ListPage } from '@/components/list/ListPage'
import type { TokenCourse } from '@/types/api'
import { useTokenCoursesPage } from './useTokenCoursesPage'

export function TokenCoursesPage() {
	const {
		search,
		setSearch,
		data,
		isLoading,
		isFetching,
		pagination,
		sorting,
		goToCreate,
		openItem,
	} = useTokenCoursesPage()

	const columns = useMemo<ColumnDef<TokenCourse, unknown>[]>(
		() => [
			{
				accessorKey: 'coin_to_money',
				header: 'Token → money',
				meta: { sortKey: 'coin_to_money', className: 'w-40' },
				cell: ({ row }) => row.original.coin_to_money,
			},
			{
				accessorKey: 'created_at',
				header: 'Created at',
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
			title="Token Courses"
			description="Token-to-money conversion rates"
			actions={
				<Button onClick={goToCreate}>
					<Icon name="plus" />
					Add
				</Button>
			}
			search={search}
			onSearchChange={setSearch}
			searchPlaceholder="Search…"
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
			emptyMessage="No token courses found"
			minWidth="480px"
			onRowClick={(r) => openItem(r.id)}
		/>
	)
}
