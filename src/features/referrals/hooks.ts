import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
	getReferral,
	listPartnerRefs,
	listReferrals,
	listStatuses,
	markReferralPaid,
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
