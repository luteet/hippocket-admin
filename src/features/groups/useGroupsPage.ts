import { useEffect, useState } from 'react'

import { usePagination } from '@/hooks/usePagination'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useGroups } from './hooks'

export const ALL = '__all__'

export const DELETED_OPTIONS = [
	{ value: ALL, label: 'All' },
	{ value: 'false', label: 'Active' },
	{ value: 'true', label: 'Deleted' },
]

export function useGroupsPage() {
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search)
	const [deleted, setDeleted] = useState(ALL)
	const pagination = usePagination({ count: 20, storageKey: 'groups' })

	// Reset to the first page when any filter changes.
	useEffect(() => {
		pagination.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch, deleted])

	const { data, isLoading, isFetching } = useGroups({
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
		data,
		isLoading,
		isFetching,
		pagination,
	}
}
