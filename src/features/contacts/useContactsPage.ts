import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { usePagination } from '@/hooks/usePagination'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useContacts } from './hooks'

export const ALL = '__all__'

export const DELETED_OPTIONS = [
	{ value: ALL, label: 'All' },
	{ value: 'false', label: 'Active' },
	{ value: 'true', label: 'Deleted' },
]

export function useContactsPage() {
	const navigate = useNavigate()
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search)
	const [deleted, setDeleted] = useState(ALL)
	const pagination = usePagination({ count: 20, storageKey: 'contacts' })

	// How many popover filters are set — shown as a badge on the Filters button.
	const activeFilterCount = deleted !== ALL ? 1 : 0
	const clearFilters = () => setDeleted(ALL)

	// Reset to the first page when any filter changes.
	useEffect(() => {
		pagination.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch, deleted])

	const { data, isLoading, isFetching } = useContacts({
		offset: pagination.offset,
		count: pagination.count,
		search: debouncedSearch || undefined,
		is_deleted: deleted === ALL ? undefined : deleted === 'true',
	})

	return {
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
		goToCreate: () => navigate('/contacts/new'),
		openContact: (id: string) => navigate(`/contacts/${id}`),
	}
}
