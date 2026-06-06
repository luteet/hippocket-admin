import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
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
		goToCreate,
		openItem,
	} = useTokenCoursesPage()

	const columns = useMemo<ColumnDef<TokenCourse, unknown>[]>(
		() => [
			{
				accessorKey: 'coin_to_money',
				header: 'Token → money',
				cell: ({ row }) => row.original.coin_to_money,
			},
			{
				accessorKey: 'created_at',
				header: 'Created at',
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
			emptyMessage="No token courses found"
			minWidth="480px"
			onRowClick={(r) => openItem(r.id)}
		/>
	)
}
