import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
	CreateFormConfigDto,
	CreateGroupFormPriceDto,
	LinkNameDto,
	TokenCourseDto,
	UpdateFormConfigDto,
	UpdateGroupFormPriceDto,
	UpdateSettingsDto,
} from '@/types/api'
import {
	createFormConfig,
	createGroupFormPrice,
	createLinkName,
	createTokenCourse,
	deleteFormConfig,
	deleteGroupFormPrice,
	deleteLinkName,
	deleteTokenCourse,
	getFormConfig,
	getSettings,
	getStatistics,
	listFormConfigs,
	listGroupFormPrices,
	listLinkNames,
	listTokenCourses,
	updateFormConfig,
	updateGroupFormPrice,
	updateLinkName,
	updateSettings,
	updateTokenCourse,
	uploadEmailTemplate,
	uploadEmailWithdrawTemplate,
	type ListParams,
} from './api'

const SETTINGS_KEY = 'settings'
const STATS_KEY = 'statistics'
const COURSES_KEY = 'coin-courses'
const LINKS_KEY = 'link-names'
const FORMS_KEY = 'form-configs'
const PRICES_KEY = 'group-form-prices'

// --- Settings (singleton) -------------------------------------------------
export function useSettings() {
	return useQuery({ queryKey: [SETTINGS_KEY], queryFn: getSettings })
}

export function useUpdateSettings() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: UpdateSettingsDto) => updateSettings(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [SETTINGS_KEY] }),
	})
}

// The two HTML email templates upload as standalone `.html` files (separate
// multipart endpoints), each returning the refreshed settings singleton.
export function useUploadEmailTemplate() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (file: File) => uploadEmailTemplate(file),
		onSuccess: () => qc.invalidateQueries({ queryKey: [SETTINGS_KEY] }),
	})
}

export function useUploadEmailWithdrawTemplate() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (file: File) => uploadEmailWithdrawTemplate(file),
		onSuccess: () => qc.invalidateQueries({ queryKey: [SETTINGS_KEY] }),
	})
}

// --- Statistics -----------------------------------------------------------
export function useStatistics() {
	return useQuery({ queryKey: [STATS_KEY], queryFn: getStatistics })
}

// --- Token Courses --------------------------------------------------------
export function useTokenCourses(params: ListParams) {
	return useQuery({
		queryKey: [COURSES_KEY, params],
		queryFn: () => listTokenCourses(params),
	})
}

// No per-id GET on /coin-courses/, so the edit page picks the record out of the
// list (the lists are short) — same approach as the catalog edit pages.
export function useTokenCourse(id: string | undefined) {
	return useQuery({
		queryKey: [COURSES_KEY, 'detail', id],
		queryFn: async () => {
			const { items } = await listTokenCourses({ offset: 0, count: 1000 })
			return items.find((i) => i.id === id) ?? null
		},
		enabled: id !== undefined,
	})
}

export function useCreateTokenCourse() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: TokenCourseDto) => createTokenCourse(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [COURSES_KEY] }),
	})
}

export function useUpdateTokenCourse() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: TokenCourseDto }) =>
			updateTokenCourse(id, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [COURSES_KEY] }),
	})
}

export function useDeleteTokenCourse() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deleteTokenCourse(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: [COURSES_KEY] }),
	})
}

// --- Link Names -----------------------------------------------------------
export function useLinkNames(params: ListParams) {
	return useQuery({
		queryKey: [LINKS_KEY, params],
		queryFn: () => listLinkNames(params),
	})
}

export function useLinkName(id: string | undefined) {
	return useQuery({
		queryKey: [LINKS_KEY, 'detail', id],
		queryFn: async () => {
			const { items } = await listLinkNames({ offset: 0, count: 1000 })
			return items.find((i) => i.id === id) ?? null
		},
		enabled: id !== undefined,
	})
}

export function useCreateLinkName() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: LinkNameDto) => createLinkName(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [LINKS_KEY] }),
	})
}

export function useUpdateLinkName() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: LinkNameDto }) =>
			updateLinkName(id, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [LINKS_KEY] }),
	})
}

export function useDeleteLinkName() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deleteLinkName(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: [LINKS_KEY] }),
	})
}

// --- Form Configurations --------------------------------------------------
export function useFormConfigs(params: ListParams) {
	return useQuery({
		queryKey: [FORMS_KEY, params],
		queryFn: () => listFormConfigs(params),
	})
}

// /form-configs/ exposes a per-id GET that includes the embedded group prices.
export function useFormConfig(id: string | undefined) {
	return useQuery({
		queryKey: [FORMS_KEY, 'detail', id],
		queryFn: () => getFormConfig(id as string),
		enabled: !!id,
	})
}

// Lightweight options for the group-form-price form's "Form" select.
export function useFormConfigOptions() {
	return useQuery({
		queryKey: [FORMS_KEY, 'options'],
		queryFn: () => listFormConfigs({ offset: 0, count: 500 }),
		staleTime: 5 * 60_000,
		select: (data) => data.items.map((f) => ({ id: f.id, name: f.name })),
	})
}

export function useCreateFormConfig() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: CreateFormConfigDto) => createFormConfig(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [FORMS_KEY] }),
	})
}

export function useUpdateFormConfig() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateFormConfigDto }) =>
			updateFormConfig(id, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: [FORMS_KEY] }),
	})
}

export function useDeleteFormConfig() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deleteFormConfig(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: [FORMS_KEY] }),
	})
}

// --- Group Form Prices ----------------------------------------------------
export function useGroupFormPrices(params: ListParams) {
	return useQuery({
		queryKey: [PRICES_KEY, params],
		queryFn: () => listGroupFormPrices(params),
	})
}

export function useGroupFormPrice(id: string | undefined) {
	return useQuery({
		queryKey: [PRICES_KEY, 'detail', id],
		queryFn: async () => {
			const { items } = await listGroupFormPrices({
				offset: 0,
				count: 1000,
			})
			return items.find((i) => i.id === id) ?? null
		},
		enabled: id !== undefined,
	})
}

export function useCreateGroupFormPrice() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (dto: CreateGroupFormPriceDto) => createGroupFormPrice(dto),
		onSuccess: () => {
			// A new price is embedded in its form-config too.
			qc.invalidateQueries({ queryKey: [PRICES_KEY] })
			qc.invalidateQueries({ queryKey: [FORMS_KEY] })
		},
	})
}

export function useUpdateGroupFormPrice() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({
			id,
			dto,
		}: {
			id: string
			dto: UpdateGroupFormPriceDto
		}) => updateGroupFormPrice(id, dto),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [PRICES_KEY] })
			qc.invalidateQueries({ queryKey: [FORMS_KEY] })
		},
	})
}

export function useDeleteGroupFormPrice() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deleteGroupFormPrice(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [PRICES_KEY] })
			qc.invalidateQueries({ queryKey: [FORMS_KEY] })
		},
	})
}
