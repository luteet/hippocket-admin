import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ListPage } from '@/components/list/ListPage'
import { FiltersPopover } from '@/components/list/FiltersPopover'
import { FilterSelect } from '@/components/list/FilterSelect'
import type { Contact } from '@/types/api'
import { useContactsPage, DELETED_OPTIONS } from './useContactsPage'
import { fullName } from './format'

export function ContactsPage() {
	const {
		search,
		setSearch,
		deleted,
		setDeleted,
		activeFilterCount,
		clearFilters,
		data,
		isLoading,
		isFetching,
		pagination,
		goToCreate,
		openContact,
	} = useContactsPage()

	const columns = useMemo<ColumnDef<Contact, unknown>[]>(
		() => [
			{
				id: 'name',
				header: 'Name',
				cell: ({ row }) =>
					fullName(
						row.original.first_name,
						row.original.last_name,
					) || <span className="text-muted-foreground">—</span>,
			},
			{
				accessorKey: 'email',
				header: 'Email',
				cell: ({ row }) =>
					row.original.email || (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'phone',
				header: 'Phone',
				cell: ({ row }) =>
					row.original.phone || (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'owner',
				header: 'Owner',
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{row.original.owner}
					</span>
				),
			},
			{
				accessorKey: 'referral_type',
				header: 'Referral Type',
				cell: ({ row }) =>
					row.original.referral_type ? (
						<Badge variant="outline">
							{row.original.referral_type}
						</Badge>
					) : (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'is_deleted',
				header: 'Status',
				cell: ({ row }) =>
					row.original.is_deleted ? (
						<Badge variant="muted">Deleted</Badge>
					) : (
						<Badge variant="success">Active</Badge>
					),
			},
			{
				accessorKey: 'date',
				header: 'Created At',
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{row.original.date.slice(0, 16)}
					</span>
				),
			},
		],
		[],
	)

	return (
		<ListPage
			title="Contacts"
			description="Browse agent contacts"
			actions={
				<Button onClick={goToCreate}>
					<Icon name="plus" />
					Add
				</Button>
			}
			search={search}
			onSearchChange={setSearch}
			searchPlaceholder="Search contacts…"
			filters={
				<FiltersPopover
					activeCount={activeFilterCount}
					onClear={clearFilters}
				>
					<FilterSelect
						label="Status"
						value={deleted}
						onChange={setDeleted}
						options={DELETED_OPTIONS}
					/>
				</FiltersPopover>
			}
			pagination={pagination}
			data={data}
			isLoading={isLoading}
			isFetching={isFetching}
			columns={columns}
			emptyMessage="No contacts found"
			minWidth="1000px"
			onRowClick={(c) => openContact(c.id)}
		/>
	)
}
