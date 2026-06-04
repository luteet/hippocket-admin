import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Search } from 'lucide-react'

import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/DataTable'
import { Input } from '@/components/ui/input'
import type { RefOption } from '@/types/api'
import {
	useReferenceListPage,
	type ReferenceKind,
} from './useReferenceListPage'

export function ReferenceListPage({ kind }: { kind: ReferenceKind }) {
	const { config, rows, total, search, setSearch, isLoading, isFetching } =
		useReferenceListPage(kind)

	const columns = useMemo<ColumnDef<RefOption, unknown>[]>(
		() => [
			{ accessorKey: 'name', header: 'Name' },
		],
		[],
	)

	return (
		<div>
			<PageHeader title={config.title} description={config.description} />

			<div className="mb-4 flex flex-wrap items-center gap-3">
				<div className="relative max-w-xs flex-1">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
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
			/>
		</div>
	)
}
