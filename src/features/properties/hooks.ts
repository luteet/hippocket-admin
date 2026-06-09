import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
	CreateCashOffersEmailDto,
	CreatePropertyDto,
	PaginationParams,
	UpdateCashOffersEmailDto,
	UpdatePropertyDto,
	UpdatePropertyImageDto,
} from '@/types/api'
import {
	createCashOffersEmail,
	createProperty,
	deleteCashOffersEmail,
	deleteProperty,
	deletePropertyImage,
	getProperty,
	listCashOffersEmails,
	listProperties,
	listPropertyImages,
	updateCashOffersEmail,
	updateProperty,
	updatePropertyImage,
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

// --- Property images (child) ---------------------------------------------

const imagesKey = (propertyId: string) => [KEY, 'detail', propertyId, 'images']

export function usePropertyImages(propertyId: string | undefined) {
	return useQuery({
		queryKey: imagesKey(propertyId as string),
		queryFn: () => listPropertyImages(propertyId as string),
		enabled: !!propertyId,
	})
}

export function useUpdatePropertyImage(propertyId: string) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({
			imageId,
			dto,
		}: {
			imageId: string
			dto: UpdatePropertyImageDto
		}) => updatePropertyImage(imageId, dto),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: imagesKey(propertyId) }),
	})
}

export function useDeletePropertyImage(propertyId: string) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (imageId: string) => deletePropertyImage(imageId),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: imagesKey(propertyId) }),
	})
}

// --- Cash offers emails (child, group-scoped) ----------------------------

const EMAILS_KEY = 'cash-offers-emails'
const emailsKey = (groupId: number | null) => [EMAILS_KEY, groupId]

export function useCashOffersEmails(groupId: number | null | undefined) {
	return useQuery({
		queryKey: emailsKey(groupId ?? null),
		queryFn: () => listCashOffersEmails(groupId ?? null),
		// Wait until the parent property (and its group) has loaded.
		enabled: groupId !== undefined,
	})
}

export function useCreateCashOffersEmail(groupId: number | null) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: CreateCashOffersEmailDto) =>
			createCashOffersEmail(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: emailsKey(groupId) }),
	})
}

export function useUpdateCashOffersEmail(groupId: number | null) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({
			offerId,
			dto,
		}: {
			offerId: string
			dto: UpdateCashOffersEmailDto
		}) => updateCashOffersEmail(offerId, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: emailsKey(groupId) }),
	})
}

export function useDeleteCashOffersEmail(groupId: number | null) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (offerId: string) => deleteCashOffersEmail(offerId),
		onSuccess: () => qc.invalidateQueries({ queryKey: emailsKey(groupId) }),
	})
}
