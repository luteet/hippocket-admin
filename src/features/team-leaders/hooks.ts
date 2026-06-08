import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { CreateTeamLeaderDto, UpdateTeamLeaderDto } from '@/types/api'
import {
	createTeamLeader,
	deleteTeamLeader,
	getTeamLeader,
	listTeamLeaders,
	updateTeamLeader,
	type TeamLeaderFilters,
} from './api'

const KEY = 'team-leaders'

export function useTeamLeaders(filters: TeamLeaderFilters) {
	return useQuery({
		queryKey: [KEY, filters],
		queryFn: () => listTeamLeaders(filters),
	})
}

export function useTeamLeader(id: string | undefined) {
	return useQuery({
		queryKey: [KEY, 'detail', id],
		queryFn: () => getTeamLeader(id as string),
		enabled: !!id,
	})
}

export function useCreateTeamLeader() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: CreateTeamLeaderDto) => createTeamLeader(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useUpdateTeamLeader() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateTeamLeaderDto }) =>
			updateTeamLeader(id, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useDeleteTeamLeader() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deleteTeamLeader(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}
