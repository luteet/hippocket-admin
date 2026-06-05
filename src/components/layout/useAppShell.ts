import { useEffect, useState } from 'react'
import { useLocation, useOutlet } from 'react-router'

import type { IconName } from '@/components/Icon'
import { useAuth } from '@/features/auth/AuthContext'
import { useMediaQuery } from '@/hooks/useMediaQuery'

// A single navigation entry. A `children` array turns it into a WordPress-style
// group: the parent stays a real link to its own page, with the related
// taxonomies/sections nested underneath and collapsible.
export type NavItem = {
	to: string
	label: string
	icon: IconName
	children?: NavItem[]
}

export const NAV_ITEMS: NavItem[] = [
	{
		to: '/partners',
		label: 'Partners',
		icon: 'building-2',
		children: [
			{ to: '/categories', label: 'Categories', icon: 'tags' },
			{ to: '/segments', label: 'Segments', icon: 'layers' },
			{ to: '/locations', label: 'Locations', icon: 'map-pin' },
			{ to: '/services', label: 'Services', icon: 'wrench' },
		],
	},
	{ to: '/referrals', label: 'Pipeline Logs', icon: 'git-branch' },
	{ to: '/agents', label: 'Agents', icon: 'users' },
	{ to: '/groups', label: 'Groups', icon: 'boxes' },
	{ to: '/statuses', label: 'Statuses', icon: 'list-checks' },
	{ to: '/withdrawals', label: 'Withdrawals', icon: 'wallet' },
]

export function useAppShell() {
	const { logout } = useAuth()
	const location = useLocation()
	// On mobile we drop the custom (OverlayScrollbars) scroll in favour of the
	// native full-page scroll. Mirror the SCSS breakpoint (md = 768px).
	const isMobile = useMediaQuery('(max-width: 767.98px)')
	// Capture the outlet element so the exiting page keeps its own content
	// during the transition (a live <Outlet /> would render the new route
	// inside the exiting wrapper and cause a flash).
	const outlet = useOutlet()
	const [collapsed, setCollapsed] = useState(false)
	const [mobileOpen, setMobileOpen] = useState(false)
	// Per-group expand overrides. A group with no override falls back to
	// "open when one of its routes is active" so the current section is always
	// revealed; an override lets the user pin it open/closed manually.
	const [groupOverrides, setGroupOverrides] = useState<
		Record<string, boolean>
	>({})

	const pathname = location.pathname

	// On mobile the page scrolls natively, so the drawer's backdrop doesn't
	// stop the page underneath from scrolling. Lock the body while the drawer
	// is open (mobile only) and restore the previous overflow on close.
	useEffect(() => {
		if (!isMobile || !mobileOpen) return
		const previous = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		return () => {
			document.body.style.overflow = previous
		}
	}, [isMobile, mobileOpen])

	const groupHasActiveRoute = (item: NavItem) =>
		[item, ...(item.children ?? [])].some(
			(entry) =>
				pathname === entry.to || pathname.startsWith(`${entry.to}/`),
		)

	const isGroupOpen = (item: NavItem) =>
		item.to in groupOverrides
			? groupOverrides[item.to]
			: groupHasActiveRoute(item)

	const toggleGroup = (item: NavItem) =>
		setGroupOverrides((prev) => ({
			...prev,
			[item.to]: !isGroupOpen(item),
		}))

	return {
		logout,
		pathname,
		outlet,
		isMobile,
		collapsed,
		toggleCollapsed: () => setCollapsed((v) => !v),
		mobileOpen,
		openMobile: () => setMobileOpen(true),
		closeMobile: () => setMobileOpen(false),
		navItems: NAV_ITEMS,
		isGroupOpen,
		toggleGroup,
	}
}
