import {
	createContext,
	useContext,
	useId,
	type Dispatch,
	type SetStateAction,
} from 'react'

// The popover body element that holds the filter fields. Filter primitives read
// it via `useFilterContainer()` and pass it as the `container` of their portalled
// Select / DatePicker dropdowns, so those land inside the popover (and the
// popover's outside-click logic doesn't treat opening a Select as "outside").
// Outside a FiltersPopover the context is `null`, which is a valid "no container".
export const FilterContainerContext = createContext<HTMLElement | null>(null)

export function useFilterContainer() {
	return useContext(FilterContainerContext)
}

// Coordinates the open state of the filter fields so only one field's dropdown /
// popover is open at a time. FiltersPopover provides it; each field claims
// `openId` when it opens and clears it when it closes. Opening one field flips
// every other field's `open` to false, closing it. `null` (outside a
// FiltersPopover) means no coordination — fields keep their own uncontrolled
// open state.
export type FilterOpenState = {
	openId: string | null
	setOpenId: Dispatch<SetStateAction<string | null>>
}

export const FilterOpenContext = createContext<FilterOpenState | null>(null)

// Controlled open props for a single filter field. Each field gets a stable id
// and is "open" only while it owns the coordinator's `openId`. Returns
// `undefined` props when there's no coordinator, so the field stays uncontrolled.
export function useFilterOpenField(): {
	open: boolean | undefined
	onOpenChange: ((open: boolean) => void) | undefined
} {
	const id = useId()
	const coord = useContext(FilterOpenContext)
	if (!coord) return { open: undefined, onOpenChange: undefined }
	return {
		open: coord.openId === id,
		onOpenChange: (next: boolean) =>
			coord.setOpenId((prev) => (next ? id : prev === id ? null : prev)),
	}
}
