import { api } from '@/lib/api/client'
import type {
	AdminSettings,
	CreateFormConfigDto,
	CreateGroupFormPriceDto,
	FormConfig,
	FormConfigData,
	GroupFormPrice,
	GroupFormPriceData,
	LinkName,
	LinkNameData,
	LinkNameDto,
	Statistics,
	TokenCourse,
	TokenCourseData,
	TokenCourseDto,
	UpdateFormConfigDto,
	UpdateGroupFormPriceDto,
	UpdateSettingsDto,
} from '@/types/api'
import type { SortParams } from '@/types/api'

// All System (base) endpoints. The four list resources share the
// `{ items, total, offset, count }` envelope and support `?search=` +
// offset/count pagination plus server-side sorting (confirmed against the
// dev API).
export interface ListParams extends SortParams {
	offset: number
	count: number
	search?: string
}

function listParams(params: ListParams): Record<string, string | number> {
	const query: Record<string, string | number> = {
		offset: params.offset,
		count: params.count,
	}
	if (params.search) query.search = params.search
	if (params.sort_by) query.sort_by = params.sort_by
	if (params.order) query.order = params.order
	return query
}

// --- Settings (singleton) -------------------------------------------------
export async function getSettings(): Promise<AdminSettings> {
	const { data } = await api.get<AdminSettings>('/settings/')
	return data
}

export async function updateSettings(
	dto: UpdateSettingsDto,
): Promise<AdminSettings> {
	const { data } = await api.put<AdminSettings>('/settings/', dto)
	return data
}

/**
 * Upload (replace) the partner email HTML template. `PUT /settings/email-template/`
 * takes a `multipart/form-data` body with a single `file` field (an `.html` file)
 * and returns the full settings object (new link in `email_template`). Clear the
 * JSON default Content-Type so axios sets `multipart/form-data` with the boundary.
 */
export async function uploadEmailTemplate(file: File): Promise<AdminSettings> {
	const form = new FormData()
	form.append('file', file)
	const { data } = await api.put<AdminSettings>(
		'/settings/email-template/',
		form,
		{ headers: { 'Content-Type': undefined } },
	)
	return data
}

/**
 * Upload (replace) the withdrawal email HTML template. Mirrors
 * {@link uploadEmailTemplate}; the new link is returned in `email_withdraw_template`.
 */
export async function uploadEmailWithdrawTemplate(
	file: File,
): Promise<AdminSettings> {
	const form = new FormData()
	form.append('file', file)
	const { data } = await api.put<AdminSettings>(
		'/settings/email-withdraw-template/',
		form,
		{ headers: { 'Content-Type': undefined } },
	)
	return data
}

// --- Statistics (read-only) -----------------------------------------------
export async function getStatistics(): Promise<Statistics> {
	const { data } = await api.get<Statistics>('/statistics/')
	return data
}

// --- Token Courses (/coin-courses/) ---------------------------------------
export async function listTokenCourses(
	params: ListParams,
): Promise<TokenCourseData> {
	const { data } = await api.get<TokenCourseData>('/coin-courses/', {
		params: listParams(params),
	})
	return data
}

export async function createTokenCourse(
	dto: TokenCourseDto,
): Promise<TokenCourse> {
	const { data } = await api.post<TokenCourse>('/coin-courses/', dto)
	return data
}

export async function updateTokenCourse(
	id: string,
	dto: TokenCourseDto,
): Promise<TokenCourse> {
	const { data } = await api.put<TokenCourse>(`/coin-courses/${id}/`, dto)
	return data
}

export async function deleteTokenCourse(id: string): Promise<void> {
	await api.delete(`/coin-courses/${id}/`)
}

// --- Link Names (/link-names/) --------------------------------------------
export async function listLinkNames(params: ListParams): Promise<LinkNameData> {
	const { data } = await api.get<LinkNameData>('/link-names/', {
		params: listParams(params),
	})
	return data
}

export async function createLinkName(dto: LinkNameDto): Promise<LinkName> {
	const { data } = await api.post<LinkName>('/link-names/', dto)
	return data
}

export async function updateLinkName(
	id: string,
	dto: LinkNameDto,
): Promise<LinkName> {
	const { data } = await api.put<LinkName>(`/link-names/${id}/`, dto)
	return data
}

export async function deleteLinkName(id: string): Promise<void> {
	await api.delete(`/link-names/${id}/`)
}

// --- Form Configurations (/form-configs/) ---------------------------------
export async function listFormConfigs(
	params: ListParams,
): Promise<FormConfigData> {
	const { data } = await api.get<FormConfigData>('/form-configs/', {
		params: listParams(params),
	})
	return data
}

export async function getFormConfig(id: string): Promise<FormConfig> {
	const { data } = await api.get<FormConfig>(`/form-configs/${id}/`)
	return data
}

export async function createFormConfig(
	dto: CreateFormConfigDto,
): Promise<FormConfig> {
	const { data } = await api.post<FormConfig>('/form-configs/', dto)
	return data
}

export async function updateFormConfig(
	id: string,
	dto: UpdateFormConfigDto,
): Promise<FormConfig> {
	const { data } = await api.put<FormConfig>(`/form-configs/${id}/`, dto)
	return data
}

export async function deleteFormConfig(id: string): Promise<void> {
	await api.delete(`/form-configs/${id}/`)
}

// --- Group Form Prices (/group-form-prices/) ------------------------------
export async function listGroupFormPrices(
	params: ListParams,
): Promise<GroupFormPriceData> {
	const { data } = await api.get<GroupFormPriceData>('/group-form-prices/', {
		params: listParams(params),
	})
	return data
}

export async function createGroupFormPrice(
	dto: CreateGroupFormPriceDto,
): Promise<GroupFormPrice> {
	const { data } = await api.post<GroupFormPrice>('/group-form-prices/', dto)
	return data
}

export async function updateGroupFormPrice(
	id: string,
	dto: UpdateGroupFormPriceDto,
): Promise<GroupFormPrice> {
	const { data } = await api.put<GroupFormPrice>(
		`/group-form-prices/${id}/`,
		dto,
	)
	return data
}

export async function deleteGroupFormPrice(id: string): Promise<void> {
	await api.delete(`/group-form-prices/${id}/`)
}
