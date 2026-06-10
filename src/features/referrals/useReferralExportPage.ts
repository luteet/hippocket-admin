import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import type { SortOrder } from '@/types/api'
import {
	useAgentRefs,
	useExportReferrals,
	useGroupOptions,
	usePartnerRefs,
	useStatuses,
} from './hooks'

export const ALL = '__all__'

const PAID_OPTIONS = [
	{ value: ALL, label: 'All' },
	{ value: 'true', label: 'Paid' },
	{ value: 'false', label: 'Unpaid' },
]

// Sort keys mirror the sortable columns on the Referrals list.
const SORT_OPTIONS = [
	{ value: 'created_at', label: 'Created' },
	{ value: 'referral_name', label: 'Referral' },
	{ value: 'agent_email', label: 'Agent' },
	{ value: 'partner_name', label: 'Partner' },
	{ value: 'status', label: 'Status' },
	{ value: 'is_paid', label: 'Payment' },
]

const ORDER_OPTIONS = [
	{ value: 'desc', label: 'Descending' },
	{ value: 'asc', label: 'Ascending' },
]

export function useReferralExportPage() {
	const navigate = useNavigate()

	const [search, setSearch] = useState('')
	const [statusLabel, setStatusLabel] = useState(ALL)
	const [isPaid, setIsPaid] = useState(ALL)
	const [createdFrom, setCreatedFrom] = useState('')
	const [createdTo, setCreatedTo] = useState('')
	const [groupIds, setGroupIds] = useState<number[]>([])
	const [partnerId, setPartnerId] = useState('')
	const [agentId, setAgentId] = useState('')
	const [sortBy, setSortBy] = useState('created_at')
	const [order, setOrder] = useState('desc')

	const { data: statuses } = useStatuses()
	const { data: partners, isLoading: isLoadingPartners } = usePartnerRefs()
	const { data: agents, isLoading: isLoadingAgents } = useAgentRefs()
	const { data: groups } = useGroupOptions()

	const exportMut = useExportReferrals()

	const statusOptions = useMemo(
		() =>
			statuses?.items.map((s) => ({ value: s.label, label: s.name })) ??
			[],
		[statuses],
	)
	const partnerOptions = useMemo(
		() => (partners ?? []).map((p) => ({ value: p.id, label: p.name })),
		[partners],
	)
	const agentOptions = useMemo(
		() =>
			(agents ?? []).map((a) => ({
				value: a.id,
				label: a.name ? `${a.name} (${a.email})` : a.email,
			})),
		[agents],
	)

	const toggleGroup = (id: number) =>
		setGroupIds((prev) =>
			prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
		)

	// Drives the "Reset" button's disabled state and a count of set filters.
	const activeFilterCount =
		(search ? 1 : 0) +
		(statusLabel !== ALL ? 1 : 0) +
		(isPaid !== ALL ? 1 : 0) +
		(createdFrom ? 1 : 0) +
		(createdTo ? 1 : 0) +
		groupIds.length +
		(partnerId ? 1 : 0) +
		(agentId ? 1 : 0)

	const resetFilters = () => {
		setSearch('')
		setStatusLabel(ALL)
		setIsPaid(ALL)
		setCreatedFrom('')
		setCreatedTo('')
		setGroupIds([])
		setPartnerId('')
		setAgentId('')
		setSortBy('created_at')
		setOrder('desc')
	}

	const handleExport = () => {
		exportMut.mutate({
			search: search || undefined,
			status_label: statusLabel === ALL ? undefined : statusLabel,
			is_paid: isPaid === ALL ? undefined : isPaid === 'true',
			created_from: createdFrom || undefined,
			created_to: createdTo || undefined,
			group_ids: groupIds.length ? groupIds : undefined,
			partner_id: partnerId || undefined,
			agent_id: agentId || undefined,
			sort_by: sortBy,
			order: order as SortOrder,
		})
	}

	return {
		search,
		setSearch,
		statusLabel,
		setStatusLabel,
		isPaid,
		setIsPaid,
		createdFrom,
		setCreatedFrom,
		createdTo,
		setCreatedTo,
		groupIds,
		toggleGroup,
		partnerId,
		setPartnerId,
		agentId,
		setAgentId,
		sortBy,
		setSortBy,
		order,
		setOrder,
		statusOptions,
		partnerOptions,
		agentOptions,
		groupOptions: groups ?? [],
		isLoadingPartners,
		isLoadingAgents,
		paidOptions: PAID_OPTIONS,
		sortOptions: SORT_OPTIONS,
		orderOptions: ORDER_OPTIONS,
		activeFilterCount,
		resetFilters,
		handleExport,
		isExporting: exportMut.isPending,
		goBack: () => navigate('/referrals'),
	}
}
