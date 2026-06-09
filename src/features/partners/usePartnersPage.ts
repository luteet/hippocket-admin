import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import { usePagination } from '@/hooks/usePagination'
import { useSorting } from '@/hooks/useSorting'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { Partner, UpdatePartnerDto, ValueType } from '@/types/api'
import { usePartners, useUpdatePartner } from './hooks'

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
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebouncedValue(search)
	const pagination = usePagination({ count: 20, storageKey: 'partners' })
	const sorting = useSorting({ defaultSortBy: 'name', defaultOrder: 'asc' })

	// Reset to the first page when the search query or sort changes.
	useEffect(() => {
		pagination.reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch, sorting.sortBy, sorting.order])

	const { data, isLoading, isFetching } = usePartners({
		offset: pagination.offset,
		count: pagination.count,
		search: debouncedSearch || undefined,
		sort_by: sorting.sortBy,
		order: sorting.order,
	})

	const updateMut = useUpdatePartner()

	// --- Inline editing -----------------------------------------------------
	const [edits, setEdits] = useState<Edits>({})
	// Ids currently being persisted (per-row checkmarks show a spinner).
	const [savingIds, setSavingIds] = useState<Set<string>>(new Set())

	// The cell renderers below are baked into a referentially-stable `columns`
	// array (so react-table never remounts the inputs and focus is preserved).
	// They therefore read live state through refs instead of closures. The refs
	// are written during render on purpose: cells must observe fresh state in
	// the same render that a keystroke triggers, which an effect can't provide.
	const editsRef = useRef(edits)
	const savingIdsRef = useRef(savingIds)
	// eslint-disable-next-line react-hooks/refs
	editsRef.current = edits
	// eslint-disable-next-line react-hooks/refs
	savingIdsRef.current = savingIds

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

	const dirtyCount = useMemo(() => Object.keys(edits).length, [edits])
	const isDirty = dirtyCount > 0

	const discard = useCallback(() => setEdits({}), [])

	const isRowDirty = useCallback((id: string) => !!editsRef.current[id], [])
	const isRowSaving = useCallback(
		(id: string) => savingIdsRef.current.has(id),
		[],
	)

	/** Persist the pending edits for the given partner ids. */
	const saveIds = async (ids: string[]) => {
		const edits = editsRef.current
		const targets = ids.filter((id) => edits[id])
		if (targets.length === 0) return
		setSavingIds((prev) => new Set([...prev, ...targets]))
		try {
			await Promise.all(
				targets.map((id) =>
					updateMut.mutateAsync({
						id,
						dto: buildUpdateDto(edits[id]),
					}),
				),
			)
			toast.success(
				`Saved ${targets.length} partner${targets.length > 1 ? 's' : ''}`,
			)
			setEdits((prev) => {
				const next = { ...prev }
				targets.forEach((id) => delete next[id])
				return next
			})
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'Failed to save changes'))
		} finally {
			setSavingIds((prev) => {
				const next = new Set(prev)
				targets.forEach((id) => next.delete(id))
				return next
			})
		}
	}
	// `saveIds` closes over the latest mutation each render; expose it through a
	// ref so the row/all handlers stay referentially stable for the columns.
	const saveIdsRef = useRef(saveIds)
	// eslint-disable-next-line react-hooks/refs
	saveIdsRef.current = saveIds

	const handleSaveRow = useCallback(
		(id: string) => saveIdsRef.current([id]),
		[],
	)
	const handleSaveAll = useCallback(
		() => saveIdsRef.current(Object.keys(editsRef.current)),
		[],
	)

	return {
		search,
		setSearch,
		data,
		isLoading,
		isFetching,
		pagination,
		sorting,
		goToCreate: () => navigate('/partners/new'),
		openPartner: (id: string) => navigate(`/partners/${id}`),
		// Inline editing
		getCell,
		setCell,
		isDirty,
		dirtyCount,
		isSaving: savingIds.size > 0,
		isRowDirty,
		isRowSaving,
		handleSaveRow,
		handleSaveAll,
		discard,
	}
}
