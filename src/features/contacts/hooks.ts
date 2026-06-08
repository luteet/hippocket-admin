import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { CreateContactDto, UpdateContactDto } from '@/types/api'
import {
	createContact,
	deleteContact,
	getContact,
	listAgentRefs,
	listContacts,
	updateContact,
	type ContactFilters,
} from './api'

const KEY = 'contacts'

export function useContacts(filters: ContactFilters) {
	return useQuery({
		queryKey: [KEY, filters],
		queryFn: () => listContacts(filters),
	})
}

export function useContact(id: string | undefined) {
	return useQuery({
		queryKey: [KEY, 'detail', id],
		queryFn: () => getContact(id as string),
		enabled: !!id,
	})
}

export function useCreateContact() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: CreateContactDto) => createContact(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useUpdateContact() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateContactDto }) =>
			updateContact(id, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useDeleteContact() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deleteContact(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useAgentRefOptions() {
	return useQuery({
		queryKey: ['refs', 'agents'],
		queryFn: listAgentRefs,
		staleTime: 5 * 60_000,
	})
}
