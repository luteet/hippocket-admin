import { api } from '@/lib/api/client'
import type { LogListData, LogsMeta, SortParams } from '@/types/api'

export interface LogFilters extends SortParams {
	offset: number
	count: number
	search?: string
	event?: string
	send_status?: string
	sms_status?: string
	created_from?: string
	created_to?: string
}

export async function listLogs(filters: LogFilters): Promise<LogListData> {
	const params: Record<string, string | number> = {
		offset: filters.offset,
		count: filters.count,
	}
	if (filters.search) params.search = filters.search
	if (filters.event) params.event = filters.event
	if (filters.send_status) params.send_status = filters.send_status
	if (filters.sms_status) params.sms_status = filters.sms_status
	if (filters.created_from) params.created_from = filters.created_from
	if (filters.created_to) params.created_to = filters.created_to
	if (filters.sort_by) params.sort_by = filters.sort_by
	if (filters.order) params.order = filters.order

	const { data } = await api.get<LogListData>('/logs/', { params })
	return data
}

export async function getLogsMeta(): Promise<LogsMeta> {
	const { data } = await api.get<LogsMeta>('/logs/meta/')
	return data
}
