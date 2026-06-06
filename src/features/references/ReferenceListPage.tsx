import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/DataTable'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { CatalogRecord } from '@/types/api'
import {
	useReferenceListPage,
	type ReferenceKind,
} from './useReferenceListPage'

export function ReferenceListPage({ kind }: { kind: ReferenceKind }) {
	const {
		config,
		rows,
		total,
		search,
		setSearch,
		isLoading,
		isFetching,
		goToCreate,
		openItem,
	} = useReferenceListPage(kind)

	const columns = useMemo<ColumnDef<CatalogRecord, unknown>[]>(
		() => [
			{ accessorKey: 'name', header: 'Name' },
			{
				accessorKey: 'sort',
				header: 'Sort',
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{row.original.sort}
					</span>
				),
			},
		],
		[],
	)

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title={config.title}
					description={config.description}
					actions={
						<Button onClick={goToCreate}>
							<Icon name="plus" />
							Add
						</Button>
					}
				/>
			</Reveal>

			<Reveal index={1}>
				<div className="mb-4 flex flex-wrap items-center gap-3">
					<div className="relative max-w-xs flex-1">
						<Icon
							name="search"
							className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
						/>
						<Input
							placeholder={config.searchPlaceholder}
							className="pl-9"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<span className="ml-auto text-sm text-muted-foreground">
						{search ? `${rows.length} of ${total}` : total}
					</span>
				</div>

				<DataTable
					columns={columns}
					data={rows}
					isLoading={isLoading || isFetching}
					emptyMessage={config.emptyMessage}
					minWidth="320px"
					onRowClick={(r) => openItem(r.id)}
				/>
			</Reveal>
		</div>
	)
}
