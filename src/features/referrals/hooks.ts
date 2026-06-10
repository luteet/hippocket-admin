import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import type { UpdateReferralDto } from '@/types/api'
import {
	deleteReferral,
	exportReferrals,
	getReferral,
	listAgentRefs,
	listGroupRefs,
	listPartnerRefs,
	listReferrals,
	listStatuses,
	markReferralPaid,
	updateReferral,
	updateReferralStatus,
	type ReferralExportFilters,
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

export function useAgentRefs() {
	return useQuery({
		queryKey: ['refs', 'agents'],
		queryFn: listAgentRefs,
		staleTime: 5 * 60_000,
	})
}

export function useExportReferrals() {
	return useMutation({
		mutationFn: (filters: ReferralExportFilters) =>
			exportReferrals(filters),
		onSuccess: ({ blob, filename }) => {
			// Stream the .xlsx blob to the browser as a file download.
			const url = URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url
			link.download = filename
			document.body.appendChild(link)
			link.click()
			link.remove()
			URL.revokeObjectURL(url)
			toast.success('Export downloaded')
		},
		onError: (error) =>
			toast.error(getApiErrorMessage(error, 'Failed to export')),
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
