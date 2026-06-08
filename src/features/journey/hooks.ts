import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
	CreateSharedPartnerDto,
	CreateSharedPartnerEntryDto,
	UpdateSharedPartnerDto,
	UpdateSharedPartnerEntryDto,
} from '@/types/api'
import {
	addSharedPartnerEntry,
	createSharedPartner,
	deleteSharedPartner,
	deleteSharedPartnerEntry,
	getSharedPartner,
	listAgentRefs,
	listPartnerRefs,
	listSharedPartners,
	updateSharedPartner,
	updateSharedPartnerEntry,
	type SharedPartnerFilters,
} from './api'

const SHARED_KEY = 'shared-partners'

// ---- Shared partners ----

export function useSharedPartners(filters: SharedPartnerFilters) {
	return useQuery({
		queryKey: [SHARED_KEY, filters],
		queryFn: () => listSharedPartners(filters),
	})
}

export function useSharedPartner(id: string | undefined) {
	return useQuery({
		queryKey: [SHARED_KEY, 'detail', id],
		queryFn: () => getSharedPartner(id as string),
		enabled: !!id,
	})
}

export function useCreateSharedPartner() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: CreateSharedPartnerDto) => createSharedPartner(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [SHARED_KEY] }),
	})
}

export function useUpdateSharedPartner() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({
			id,
			dto,
		}: {
			id: string
			dto: UpdateSharedPartnerDto
		}) => updateSharedPartner(id, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [SHARED_KEY] }),
	})
}

export function useDeleteSharedPartner() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deleteSharedPartner(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: [SHARED_KEY] }),
	})
}

// ---- Entries ----

export function useAddSharedPartnerEntry(sharedId: string) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: CreateSharedPartnerEntryDto) =>
			addSharedPartnerEntry(sharedId, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [SHARED_KEY] }),
	})
}

export function useUpdateSharedPartnerEntry(sharedId: string) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({
			entryId,
			dto,
		}: {
			entryId: string
			dto: UpdateSharedPartnerEntryDto
		}) => updateSharedPartnerEntry(sharedId, entryId, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [SHARED_KEY] }),
	})
}

export function useDeleteSharedPartnerEntry(sharedId: string) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (entryId: string) =>
			deleteSharedPartnerEntry(sharedId, entryId),
		onSuccess: () => qc.invalidateQueries({ queryKey: [SHARED_KEY] }),
	})
}

// ---- Reference pickers ----

export function useAgentRefOptions(search?: string) {
	return useQuery({
		queryKey: ['refs', 'agents', search ?? ''],
		queryFn: () => listAgentRefs(search),
		staleTime: 5 * 60_000,
		// Keep the previous results on screen while the next search loads, so the
		// list doesn't flash empty between keystrokes.
		placeholderData: (prev) => prev,
	})
}

export function usePartnerRefOptions() {
	return useQuery({
		queryKey: ['refs', 'partners'],
		queryFn: listPartnerRefs,
		staleTime: 5 * 60_000,
	})
}
