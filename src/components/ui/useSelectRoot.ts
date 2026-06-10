import {
	createContext,
	useCallback,
	useEffect,
	useRef,
	useState,
	type ComponentPropsWithoutRef,
} from 'react'
import type * as SelectPrimitive from '@radix-ui/react-select'

// Radix Select unmounts its content the instant `open` flips to false (it has
// no `forceMount`), so a CSS/motion close animation never gets to play — the
// dropdown opens with a fade but snaps shut. Work around it by controlling
// `open` here and delaying the real unmount by the fade-out length, exposing a
// `closing` flag the content reads to play the exit. Must match the
// `select-fade-out` duration in _select.scss.
const CLOSE_DURATION = 150

export const SelectCloseContext = createContext(false)

type SelectRootProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Root>

// Fade-aware open state for the Select root: opening is immediate, closing keeps
// Radix mounted for the fade then unmounts. Returns the local `open`/`closing`
// state and the `onOpenChange` handler to feed back into the primitive.
export function useSelectRoot({
	open: openProp,
	defaultOpen,
	onOpenChange,
}: Pick<SelectRootProps, 'open' | 'defaultOpen' | 'onOpenChange'>) {
	const [open, setOpen] = useState(openProp ?? defaultOpen ?? false)
	const [closing, setClosing] = useState(false)
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
	const prevProp = useRef(openProp)

	useEffect(() => () => clearTimeout(timer.current), [])

	// Drive the local, fade-aware open state. Opening is immediate; closing keeps
	// Radix mounted for the fade, then unmounts.
	const apply = useCallback((next: boolean) => {
		if (next) {
			clearTimeout(timer.current)
			setClosing(false)
			setOpen(true)
		} else {
			setClosing(true)
			timer.current = setTimeout(() => {
				setOpen(false)
				setClosing(false)
			}, CLOSE_DURATION)
		}
	}, [])

	// Controlled mode: mirror external `open` changes into the local state (e.g.
	// FiltersPopover closing this Select when another field opens). Only react to
	// actual changes so the initial render doesn't trigger a spurious fade.
	useEffect(() => {
		if (openProp === undefined) return
		if (openProp === prevProp.current) return
		prevProp.current = openProp
		apply(openProp)
	}, [openProp, apply])

	const handleOpenChange = useCallback(
		(next: boolean) => {
			onOpenChange?.(next)
			// Uncontrolled: drive our own state. Controlled: the effect above
			// applies it once the parent updates `open`.
			if (openProp === undefined) apply(next)
		},
		[onOpenChange, openProp, apply],
	)

	return { open, closing, handleOpenChange }
}
