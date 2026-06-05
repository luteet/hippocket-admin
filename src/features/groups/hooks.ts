import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { CreateGroupDto, UpdateGroupDto } from '@/types/api'
import {
	createGroup,
	deleteGroup,
	getGroup,
	listAgentRefs,
	listGroups,
	updateGroup,
	type GroupFilters,
} from './api'

const KEY = 'groups'

export function useGroups(filters: GroupFilters) {
	return useQuery({
		queryKey: [KEY, filters],
		queryFn: () => listGroups(filters),
	})
}

export function useGroup(id: number | undefined) {
	return useQuery({
		queryKey: [KEY, 'detail', id],
		queryFn: () => getGroup(id as number),
		enabled: id !== undefined,
	})
}

export function useCreateGroup() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: CreateGroupDto) => createGroup(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useUpdateGroup() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, dto }: { id: number; dto: UpdateGroupDto }) =>
			updateGroup(id, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useDeleteGroup() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: number) => deleteGroup(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useAgentOptions() {
	return useQuery({
		queryKey: ['refs', 'agents'],
		queryFn: listAgentRefs,
		staleTime: 5 * 60_000,
	})
}
