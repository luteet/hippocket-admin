import { useMemo } from 'react'
import { Link } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'

import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { TimeAgo } from '@/components/TimeAgo'
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
		onRefresh,
		pagination,
		sorting,
		goToCreate,
		openContact,
	} = useContactsPage()

	const columns = useMemo<ColumnDef<Contact, unknown>[]>(
		() => [
			{
				id: 'name',
				header: 'Name',
				meta: { className: 'w-48' },
				cell: ({ row }) =>
					fullName(
						row.original.first_name,
						row.original.last_name,
					) || <span className="text-muted-foreground">—</span>,
			},
			{
				accessorKey: 'email',
				header: 'Email',
				meta: { sortKey: 'email', className: 'w-64' },
				cell: ({ row }) =>
					row.original.email || (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'phone',
				header: 'Phone',
				meta: { sortKey: 'phone', className: 'w-40' },
				cell: ({ row }) =>
					row.original.phone ? (
						<Tooltip content={row.original.phone}>
							<span className="block truncate">
								{row.original.phone}
							</span>
						</Tooltip>
					) : (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: 'owner',
				header: 'Owner',
				meta: { className: 'w-48' },
				cell: ({ row }) => {
					const { owner, user_id, partner_user_id } = row.original
					const to = user_id
						? `/agents/${user_id}`
						: partner_user_id
							? `/partners/${partner_user_id}`
							: null
					if (!to || !owner)
						return (
							<span className="text-muted-foreground">
								{owner || '—'}
							</span>
						)
					return (
						<Tooltip content={owner}>
							<Link
								to={to}
								className="link block truncate"
								onClick={(e) => e.stopPropagation()}
							>
								{owner}
							</Link>
						</Tooltip>
					)
				},
			},
			{
				accessorKey: 'referral_type',
				header: 'Referral Type',
				meta: { sortKey: 'referral_type', className: 'w-36' },
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
				meta: { sortKey: 'is_deleted', className: 'w-28' },
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
				meta: { sortKey: 'date', className: 'w-40' },
				cell: ({ row }) => (
					<TimeAgo
						value={row.original.date}
						className="text-muted-foreground"
					/>
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
			onRefresh={onRefresh}
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
			sorting={{
				sortBy: sorting.sortBy,
				order: sorting.order,
				onToggle: sorting.toggle,
			}}
			emptyMessage="No contacts found"
			minWidth="1000px"
			onRowClick={(c) => openContact(c.id)}
		/>
	)
}
