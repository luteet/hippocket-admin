import { useRef, useState } from 'react'

import { useMediaQuery } from '@/hooks/useMediaQuery'

// Hover-flyout state for a collapsed nav group. On the collapsed desktop rail
// the inline children are hidden (no room) and a CSS flyout would be clipped by
// the sidebar's overflow — so the children pop out in a portaled Popover that
// opens on hover. Disabled when expanded or on mobile (the drawer always shows
// the inline children there).
export function useNavGroup(collapsed: boolean) {
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const flyoutEnabled = collapsed && isDesktop

	const [flyoutOpen, setFlyoutOpen] = useState(false)
	const closeTimer = useRef<number | null>(null)

	const cancelClose = () => {
		if (closeTimer.current !== null) {
			window.clearTimeout(closeTimer.current)
			closeTimer.current = null
		}
	}

	const openFlyout = () => {
		cancelClose()
		setFlyoutOpen(true)
	}

	// Small grace period so moving the cursor from the icon across the gap to
	// the flyout panel doesn't dismiss it.
	const scheduleClose = () => {
		cancelClose()
		closeTimer.current = window.setTimeout(() => setFlyoutOpen(false), 120)
	}

	const closeFlyout = () => {
		cancelClose()
		setFlyoutOpen(false)
	}

	return {
		flyoutEnabled,
		// Gate the open flag on `flyoutEnabled` so expanding the rail (or
		// resizing to mobile) while a flyout is open closes it immediately.
		flyoutOpen: flyoutEnabled && flyoutOpen,
		setFlyoutOpen,
		openFlyout,
		scheduleClose,
		closeFlyout,
	}
}
