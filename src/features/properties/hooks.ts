import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
	CreatePropertyDto,
	PaginationParams,
	UpdatePropertyDto,
} from '@/types/api'
import {
	createProperty,
	deleteProperty,
	getProperty,
	listProperties,
	updateProperty,
} from './api'

const KEY = 'properties'

export function useProperties(params: PaginationParams) {
	return useQuery({
		queryKey: [KEY, params],
		queryFn: () => listProperties(params),
	})
}

export function useProperty(id: string | undefined) {
	return useQuery({
		queryKey: [KEY, 'detail', id],
		queryFn: () => getProperty(id as string),
		enabled: !!id,
	})
}

export function useCreateProperty() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: CreatePropertyDto) => createProperty(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useUpdateProperty() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdatePropertyDto }) =>
			updateProperty(id, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useDeleteProperty() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deleteProperty(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}
