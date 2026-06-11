import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
	getCoreRowModel,
	useReactTable,
	type RowSelectionState,
} from '@tanstack/react-table'
import {
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import type { DataTableProps } from './DataTable.types'

export function useDataTable<TData>({
	columns,
	data,
	isLoading,
	onRowClick,
	reorder,
	selection,
}: DataTableProps<TData>) {
	// A local mirror of the rows so a drop reorders them synchronously. dnd-kit
	// resets the dragged row's transform on drop; if the order hasn't changed
	// yet, the row snaps back to its origin for a frame before the (async) cache
	// update moves it. Updating this state inside `onDragEnd` flips the order in
	// the same frame, so the row settles straight into its new slot. Resetting
	// it during render (the React-blessed "derive state from props" pattern)
	// keeps it in sync with later data changes (refetch, search, sort).
	const [orderedData, setOrderedData] = useState(data)
	const [prevData, setPrevData] = useState(data)
	if (data !== prevData) {
		setPrevData(data)
		setOrderedData(data)
	}
	const tableData = reorder ? orderedData : data

	// Both reorder and selection key rows by the record id (not the row index):
	// reorder needs it so dnd-kit moves the real DOM node, selection needs it so
	// the controlled `selectedIds` survive a refetch/reorder of the rows.
	const rowIdOf = reorder?.getRowId ?? selection?.getRowId

	// Mirror the controlled `selectedIds` into TanStack's row-selection model
	// (`{ [id]: true }`). Driving the table's own model keeps "select all on
	// page" / indeterminate header state correct for free.
	const rowSelection = useMemo<RowSelectionState>(() => {
		const state: RowSelectionState = {}
		selection?.selectedIds.forEach((id) => {
			state[String(id)] = true
		})
		return state
	}, [selection?.selectedIds])

	const table = useReactTable({
		data: tableData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getRowId: rowIdOf ? (row) => String(rowIdOf(row)) : undefined,
		enableRowSelection: !!selection,
		state: selection ? { rowSelection } : undefined,
		onRowSelectionChange: selection
			? (updater) => {
					const next =
						typeof updater === 'function'
							? updater(rowSelection)
							: updater
					selection.onSelectionChange(
						Object.keys(next).filter((id) => next[id]),
					)
				}
			: undefined,
	})

	// Drag-and-drop reordering plumbing (no-op unless `reorder` is supplied).
	const sensors = useSensors(
		// A small activation distance so a click on the handle still reads as a
		// click, not a drag.
		useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)
	const reorderIds = useMemo(
		() => (reorder ? tableData.map(reorder.getRowId) : []),
		[reorder, tableData],
	)
	const handleDragEnd = (event: DragEndEvent) => {
		if (!reorder) return
		const { active, over } = event
		if (!over || active.id === over.id) return
		const oldIndex = reorderIds.findIndex((id) => id === active.id)
		const newIndex = reorderIds.findIndex((id) => id === over.id)
		if (oldIndex === -1 || newIndex === -1) return
		const next = arrayMove(orderedData, oldIndex, newIndex)
		setOrderedData(next)
		reorder.onReorder(next.map(reorder.getRowId))
	}

	// Where the press started — used to tell a real click apart from a drag
	// (e.g. selecting text in an inline input). A drag releasing on the row
	// fires `click` on the row, so without this it would navigate. We only
	// trigger onRowClick for a genuine press-release on the row: the press must
	// have been recorded here (a control that stops its own mousedown — an inline
	// Select/Input — clears it, so its clicks, and any stray click an overlay
	// fires on close, never navigate) and the pointer must have barely moved.
	const downPos = useRef<{ x: number; y: number } | null>(null)

	const handleRowClick = onRowClick
		? (row: TData) => (e: React.MouseEvent) => {
				const start = downPos.current
				downPos.current = null
				if (
					!start ||
					Math.hypot(e.clientX - start.x, e.clientY - start.y) > 4
				) {
					return
				}
				onRowClick(row)
			}
		: undefined

	const rowMouseDown = onRowClick
		? (e: React.MouseEvent<HTMLTableRowElement>) => {
				downPos.current = { x: e.clientX, y: e.clientY }
			}
		: undefined

	// When the table is empty, the placeholder cell spans every column, so on a
	// wide (horizontally scrolling) table its centered content would sit far off
	// to the right. We instead pin it to the scroll container's *visible* width:
	// measure that width here and render the empty block `sticky left-0` at that
	// size, so it stays centered in view as the table scrolls sideways.
	const scrollRef = useRef<HTMLDivElement>(null)
	const isEmpty = !isLoading && table.getRowModel().rows.length === 0
	const [viewportWidth, setViewportWidth] = useState<number>()
	useLayoutEffect(() => {
		const el = scrollRef.current
		if (!el || !isEmpty) return
		const update = () => setViewportWidth(el.clientWidth)
		update()
		const ro = new ResizeObserver(update)
		ro.observe(el)
		return () => ro.disconnect()
	}, [isEmpty])

	return {
		table,
		sensors,
		reorderIds,
		handleDragEnd,
		rowMouseDown,
		handleRowClick,
		scrollRef,
		viewportWidth,
	}
}
