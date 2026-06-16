import { useEffect, useState } from 'react'

import { usePagination } from '@/hooks/usePagination'
import { useSorting } from '@/hooks/useSorting'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useLogs, useLogsMeta } from './hooks'

// Sentinel for the "no filter" option in the event / send-status selects (an
// empty string can't be a SelectItem value in shadcn's Select).
export const ALL = '__all__'

// The audit-log sections share one page; the slug selects which `event` is
// locked. `referrals-sent` / `referrals-closed` pin a single event and hide the
// event filter; `all` (event undefined) shows every record with a free event
// filter. The slug doubles as the URL segment under `/logs`.
export type LogSlug = 'all' | 'referrals-sent' | 'referrals-closed'

// SMS delivery statuses for the `sms_status` filter. The /logs/meta/ endpoint
// doesn't enumerate these, so the list is fixed (mirrors the documented Twilio
// states); the backend filters one status at a time (`?sms_status=…`).
export const SMS_STATUSES = [
	'delivered',
	'undelivered',
	'failed',
	'queued',
	'sent',
	'sending',
]

export interface LogView {
	title: string
	description: string
	// Locked event for this view; undefined → all events (event filter shown).
	event?: string
}

export const LOG_VIEWS: Record<LogSlug, LogView> = {
	all: {
		title: 'Audit Logs',
		description: 'Every recorded admin and partner event',
	},
	'referrals-sent': {
		title: 'Referrals Sent',
		description: 'Contacts agents have sent to partners',
		event: 'referral_sent',
	},
	'referrals-closed': {
		title: 'Referrals Closed',
		description: 'Referrals that have been closed',
		event: 'referral_closed',
	},
}

export function useLogsPage(slug: LogSlug) {
	const view = LOG_VIEWS[slug]

	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search)
	// Only used on the "all" view; pinned views derive their event from `view`.
	const [event, setEvent] = useState(ALL)
	const [sendStatus, setSendStatus] = useState(ALL)
	const [smsStatus, setSmsStatus] = useState(ALL)
	const [createdFrom, setCreatedFrom] = useState('')
	const [createdTo, setCreatedTo] = useState('')
	// A per-slug storage key so each section keeps its own page size.
	const pagination = usePagination({ count: 20, storageKey: `logs:${slug}` })
	const sorting = useSorting({
		defaultSortBy: 'created_at',
		defaultOrder: 'desc',
	})

	const { data: meta } = useLogsMeta()

	const effectiveEvent = view.event ?? (event === ALL ? undefined : event)

	// How many of the popover filters are currently set — shown as a badge on
	// the "Filters" button so active filters are visible while it's collapsed.
	const showEventFilter = view.event === undefined
	const activeFilterCount =
		(showEventFilter && event !== ALL ? 1 : 0) +
		(sendStatus !== ALL ? 1 : 0) +
		(smsStatus !== ALL ? 1 : 0) +
		(createdFrom ? 1 : 0) +
		(createdTo ? 1 : 0)

	const clearFilters = () => {
		setEvent(ALL)
		setSendStatus(ALL)
		setSmsStatus(ALL)
		setCreatedFrom('')
		setCreatedTo('')
	}

	useEffect(() => {
		pagination.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		debouncedSearch,
		effectiveEvent,
		sendStatus,
		smsStatus,
		createdFrom,
		createdTo,
		sorting.sortBy,
		sorting.order,
	])

	const { data, isLoading, isFetching, refetch } = useLogs({
		offset: pagination.offset,
		count: pagination.count,
		search: debouncedSearch || undefined,
		event: effectiveEvent,
		send_status: sendStatus === ALL ? undefined : sendStatus,
		sms_status: smsStatus === ALL ? undefined : smsStatus,
		created_from: createdFrom || undefined,
		created_to: createdTo || undefined,
		sort_by: sorting.sortBy,
		order: sorting.order,
	})

	return {
		view,
		// The event filter is offered only when the view doesn't pin one.
		showEventFilter,
		activeFilterCount,
		clearFilters,
		search,
		setSearch,
		event,
		setEvent,
		sendStatus,
		setSendStatus,
		smsStatus,
		setSmsStatus,
		createdFrom,
		setCreatedFrom,
		createdTo,
		setCreatedTo,
		events: meta?.events ?? [],
		sendStatuses: meta?.send_statuses ?? [],
		data,
		isLoading,
		isFetching,
		onRefresh: () => void refetch(),
		pagination,
		sorting,
	}
}
