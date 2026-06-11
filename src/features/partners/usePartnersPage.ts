import { useState, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

import { getApiErrorMessage } from '@/lib/api/client'
import { usePagination } from '@/hooks/usePagination'
import { useSorting } from '@/hooks/useSorting'
import { useUrlParams, useUrlSearch } from '@/hooks/useUrlState'
import { useRowSelection } from '@/hooks/useRowSelection'
import { useBulkAction } from '@/hooks/useBulkAction'
import type {
	Partner,
	PartnersData,
	UpdatePartnerDto,
	ValueType,
} from '@/types/api'
import { usePartners } from './hooks'
import { deletePartner, updatePartner } from './api'

/** Stop row-click navigation when interacting with an inline editor. */
export const stopRowClick = (e: { stopPropagation: () => void }) =>
	e.stopPropagation()

/** Partner fields editable inline in the table. */
export type EditableField =
	| 'potential_value'
	| 'value_type'
	| 'agent_fee'
	| 'group_owner_fee'
	| 'hippocket_fee'

/** Pending edits, keyed by partner id; values are kept as raw input strings. */
type Edits = Record<string, Partial<Record<EditableField, string>>>

/** The partner's stored value for a field, as a string for diffing/inputs. */
function originalString(partner: Partner, field: EditableField): string {
	const value = partner[field]
	return value == null ? '' : String(value)
}

/** Turn one row's pending edits into an update payload. */
function buildUpdateDto(
	row: Partial<Record<EditableField, string>>,
): UpdatePartnerDto {
	const dto: UpdatePartnerDto = {}
	if (row.value_type !== undefined)
		dto.value_type = row.value_type as ValueType
	if (row.potential_value !== undefined)
		dto.potential_value =
			row.potential_value === '' ? null : Number(row.potential_value)
	if (row.agent_fee !== undefined) dto.agent_fee = Number(row.agent_fee)
	if (row.group_owner_fee !== undefined)
		dto.group_owner_fee = Number(row.group_owner_fee)
	if (row.hippocket_fee !== undefined)
		dto.hippocket_fee = Number(row.hippocket_fee)
	return dto
}

export function usePartnersPage() {
	const navigate = useNavigate()
	// Search, sort, page and page size all live in the URL (deep-linkable,
	// survives reload). The search box keeps instant local state and writes the
	// `q` param (resetting the page) only after a debounce, so typing doesn't
	// push a navigation per keystroke; `committedSearch` is the URL value that
	// drives the query.
	const [, setParams] = useUrlParams()
	const [search, setSearch, committedSearch] = useUrlSearch('q')
	const pagination = usePagination({
		count: 20,
		storageKey: 'partners',
		syncToUrl: true,
	})
	const sorting = useSorting({
		defaultSortBy: 'name',
		defaultOrder: 'asc',
		syncToUrl: true,
	})

	const { data, isLoading, isFetching, refetch } = usePartners({
		offset: pagination.offset,
		count: pagination.count,
		search: committedSearch || undefined,
		sort_by: sorting.sortBy,
		order: sorting.order,
	})

	const qc = useQueryClient()

	// --- Inline editing (auto-save) -----------------------------------------
	// There's no explicit Save button: each field persists on its own as soon as
	// the user is done with it — number inputs commit on blur, the value-type
	// select on change — and a toast confirms it. `edits` only holds the
	// in-progress typed value so a number input stays controlled while editing;
	// it is intentionally NOT cleared after a save (the staged text already
	// equals the patched value).
	const [edits, setEdits] = useState<Edits>({})

	// The cell renderers below are baked into a referentially-stable `columns`
	// array (so react-table never remounts the inputs and focus is preserved).
	// They therefore read live state through refs instead of closures. The ref is
	// written during render on purpose: cells must observe fresh state in the
	// same render that a keystroke triggers, which an effect can't provide.
	const editsRef = useRef(edits)
	// eslint-disable-next-line react-hooks/refs
	editsRef.current = edits

	/** Current value to display in a cell (pending edit, else stored value). */
	const getCell = useCallback((partner: Partner, field: EditableField) => {
		return (
			editsRef.current[partner.id]?.[field] ??
			originalString(partner, field)
		)
	}, [])

	/** Stage an edit; drops it again if the value matches the stored one. */
	const setCell = useCallback(
		(partner: Partner, field: EditableField, value: string) => {
			setEdits((prev) => {
				const row = { ...prev[partner.id] }
				if (value === originalString(partner, field)) {
					delete row[field]
				} else {
					row[field] = value
				}
				const next = { ...prev }
				if (Object.keys(row).length === 0) delete next[partner.id]
				else next[partner.id] = row
				return next
			})
		},
		[],
	)

	// `id:field` keys with a PUT in flight, so a repeated commit (e.g. a second
	// blur before the first resolves) doesn't fire a duplicate request.
	const inFlight = useRef<Set<string>>(new Set())

	/** Persist a single changed field for one partner. No-op if unchanged. */
	const saveField = async (
		partner: Partner,
		field: EditableField,
		value: string,
	) => {
		if (value === originalString(partner, field)) return
		const key = `${partner.id}:${field}`
		if (inFlight.current.has(key)) return
		inFlight.current.add(key)
		try {
			const saved = await updatePartner(
				partner.id,
				buildUpdateDto({ [field]: value }),
			)
			// Patch the saved row into every cached partners list in place rather
			// than invalidating: a refetch flips the query to `isFetching`, which
			// the list shell renders as a full-table skeleton. An in-place patch
			// keeps the rows on screen and just updates this one record. The
			// `['partners']` filter also catches the single-partner detail query
			// (whose data has no `items`), so guard before mapping.
			qc.setQueriesData<PartnersData>(
				{ queryKey: ['partners'] },
				(old) =>
					old && Array.isArray(old.items)
						? {
								...old,
								items: old.items.map((p) =>
									p.id === saved.id ? saved : p,
								),
							}
						: old,
			)
			toast.success('Partner updated')
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to update partner'))
		} finally {
			inFlight.current.delete(key)
		}
	}
	// `saveField` closes over the latest mutation each render; expose it through a
	// ref so the stable handler the columns capture always hits the current one.
	const saveFieldRef = useRef(saveField)
	// eslint-disable-next-line react-hooks/refs
	saveFieldRef.current = saveField

	const handleSaveField = useCallback(
		(partner: Partner, field: EditableField, value: string) =>
			saveFieldRef.current(partner, field, value),
		[],
	)

	// --- Bulk actions (hide / show / delete the selected partners) ----------
	const {
		selectedIds,
		setSelectedIds,
		clear: clearSelection,
	} = useRowSelection(data?.items)
	const { run, isRunning: isBulkRunning } = useBulkAction<Partner>()

	const selectedItems = useMemo(
		() => data?.items.filter((p) => selectedIds.includes(p.id)) ?? [],
		[data, selectedIds],
	)

	const finishBulk = (failed: Partner[]) => {
		qc.invalidateQueries({ queryKey: ['partners'] })
		setSelectedIds(failed.map((p) => p.id))
	}

	const bulkSetHidden = (isHide: boolean, verb: string) =>
		run(selectedItems, (p) => updatePartner(p.id, { is_hide: isHide }), {
			verb,
			onDone: finishBulk,
		})

	const bulkDelete = () =>
		run(selectedItems, (p) => deletePartner(p.id), {
			verb: 'Deleted',
			onDone: finishBulk,
		})

	return {
		selectedIds,
		setSelectedIds,
		clearSelection,
		selectedCount: selectedItems.length,
		isBulkRunning,
		bulkHide: () => bulkSetHidden(true, 'Hid'),
		bulkShow: () => bulkSetHidden(false, 'Showed'),
		bulkDelete,
		search,
		setSearch,
		// Whether the empty list is "filtered to nothing" vs "no records yet" —
		// the page picks the right empty state from this.
		hasFilters: Boolean(committedSearch),
		// Clear via the URL directly so the input empties at once (no debounce).
		clearFilters: () => setParams({ q: null, page: null }),
		data,
		isLoading,
		isFetching,
		onRefresh: () => void refetch(),
		pagination,
		sorting,
		goToCreate: () => navigate('/partners/new'),
		openPartner: (id: string) => navigate(`/partners/${id}`),
		// Inline editing (auto-save per field)
		getCell,
		setCell,
		saveField: handleSaveField,
	}
}
