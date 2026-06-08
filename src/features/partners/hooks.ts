import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
	CreatePartnerDto,
	CreatePartnerReviewDto,
	PaginationParams,
	UpdatePartnerDto,
	UpdatePartnerReviewDto,
} from '@/types/api'
import {
	createPartner,
	createPartnerReview,
	deletePartner,
	deletePartnerReview,
	getPartner,
	listPartnerReviews,
	listPartners,
	updatePartner,
	updatePartnerReview,
	uploadPartnerLogo,
	uploadPartnerPreview,
	uploadPartnerReviewAvatar,
} from './api'

const KEY = 'partners'

export function usePartners(params: PaginationParams) {
	return useQuery({
		queryKey: [KEY, params],
		queryFn: () => listPartners(params),
	})
}

export function usePartner(id: string | undefined) {
	return useQuery({
		queryKey: [KEY, 'detail', id],
		queryFn: () => getPartner(id as string),
		enabled: !!id,
	})
}

export function useCreatePartner() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: CreatePartnerDto) => createPartner(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useUpdatePartner() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdatePartnerDto }) =>
			updatePartner(id, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

export function useDeletePartner() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deletePartner(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
	})
}

/**
 * Upload a partner's logo. Like {@link useUploadAgentAvatar}, this deliberately
 * does NOT invalidate the partners query: the edit form re-syncs (`reset`) when
 * its cached partner changes, so refetching here would wipe in-progress edits.
 * The caller updates its own preview from the returned partner instead.
 */
export function useUploadPartnerLogo() {
	return useMutation({
		mutationFn: ({ id, file }: { id: string; file: File }) =>
			uploadPartnerLogo(id, file),
	})
}

/** Upload a partner's video preview cover. See {@link useUploadPartnerLogo}. */
export function useUploadPartnerPreview() {
	return useMutation({
		mutationFn: ({ id, file }: { id: string; file: File }) =>
			uploadPartnerPreview(id, file),
	})
}

const reviewsKey = (partnerId: string) => [KEY, 'detail', partnerId, 'reviews']

export function usePartnerReviews(partnerId: string | undefined) {
	return useQuery({
		queryKey: reviewsKey(partnerId as string),
		queryFn: () => listPartnerReviews(partnerId as string),
		enabled: !!partnerId,
	})
}

export function useCreatePartnerReview(partnerId: string) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: CreatePartnerReviewDto) =>
			createPartnerReview(partnerId, dto),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: reviewsKey(partnerId) }),
	})
}

export function useUpdatePartnerReview(partnerId: string) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({
			reviewId,
			dto,
		}: {
			reviewId: string
			dto: UpdatePartnerReviewDto
		}) => updatePartnerReview(partnerId, reviewId, dto),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: reviewsKey(partnerId) }),
	})
}

export function useDeletePartnerReview(partnerId: string) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (reviewId: string) =>
			deletePartnerReview(partnerId, reviewId),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: reviewsKey(partnerId) }),
	})
}

/**
 * Upload a review's avatar. Unlike the agent/partner media hooks, invalidating
 * is safe here: the review dialog's `reset` keys off a captured `editing`
 * reference (not the live query value), so refetching won't wipe in-progress
 * name/text edits — and it keeps the reviews list's avatar fresh.
 */
export function useUploadPartnerReviewAvatar(partnerId: string) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ reviewId, file }: { reviewId: string; file: File }) =>
			uploadPartnerReviewAvatar(partnerId, reviewId, file),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: reviewsKey(partnerId) }),
	})
}
