import { useEffect, useState } from 'react'

// '⌘' on macOS, 'Ctrl' everywhere else — for the hotkey hint shown on the
// search trigger and in the palette footer.
export const MOD_KEY_LABEL =
	typeof navigator !== 'undefined' &&
	/mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent)
		? '⌘'
		: 'Ctrl'

/**
 * Owns the global command-palette open state and the ⌘K / Ctrl+K hotkey that
 * toggles it from anywhere in the app. Mounted once in the AppShell.
 */
export function useGlobalSearch() {
	const [open, setOpen] = useState(false)

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault()
				setOpen((v) => !v)
			}
		}
		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}, [])

	return {
		open,
		openSearch: () => setOpen(true),
		closeSearch: () => setOpen(false),
	}
}
