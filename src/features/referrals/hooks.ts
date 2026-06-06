import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { UpdateReferralDto } from '@/types/api'
import {
	deleteReferral,
	getReferral,
	listGroupRefs,
	listPartnerRefs,
	listReferrals,
	listStatuses,
	markReferralPaid,
	updateReferral,
	updateReferralStatus,
	type ReferralFilters,
} from './api'

const KEY = 'referrals'

export function useReferrals(filters: ReferralFilters) {
	return useQuery({
		queryKey: [KEY, filters],
		queryFn: () => listReferrals(filters),
	})
}

export function useReferral(id: string | undefined) {
	return useQuery({
		queryKey: [KEY, 'detail', id],
		queryFn: () => getReferral(id as string),
		enabled: !!id,
	})
}

export function useStatuses() {
	return useQuery({
		queryKey: ['statuses'],
		queryFn: listStatuses,
		staleTime: 5 * 60_000,
	})
}

export function usePartnerRefs() {
	return useQuery({
		queryKey: ['refs', 'partners'],
		queryFn: listPartnerRefs,
		staleTime: 5 * 60_000,
	})
}

export function useGroupOptions() {
	return useQuery({
		queryKey: ['refs', 'groups'],
		queryFn: listGroupRefs,
		staleTime: 5 * 60_000,
	})
}

export function useUpdateReferral() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateReferralDto }) =>
			updateReferral(id, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useDeleteReferral() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deleteReferral(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useUpdateReferralStatus() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, newStatus }: { id: string; newStatus: string }) =>
			updateReferralStatus(id, newStatus),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useMarkReferralPaid() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => markReferralPaid(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}
