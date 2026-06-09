import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useOutlet } from 'react-router'

import type { IconName } from '@/components/Icon'
import { useMediaQuery } from '@/hooks/useMediaQuery'

// A single navigation entry. A `children` array turns it into a WordPress-style
// group: the parent stays a real link to its own page, with the related
// taxonomies/sections nested underneath and collapsible.
//
// `groupOnly` marks a parent that has NO page of its own — it acts as a button
// that opens the group and jumps to its first child (see `selectGroup`).
export type NavItem = {
	to: string
	label: string
	icon: IconName
	children?: NavItem[]
	groupOnly?: boolean
	// Match the active state on the exact path only (NavLink `end`). Needed for a
	// child whose path is a prefix of its siblings' (e.g. `/logs` vs
	// `/logs/referrals-sent`), so it doesn't stay highlighted on the sub-pages.
	end?: boolean
}

export const NAV_ITEMS: NavItem[] = [
	{ to: '/', label: 'Dashboard', icon: 'layout-dashboard', end: true },
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
	{
		to: '/referrals',
		label: 'Pipeline',
		icon: 'git-branch',
		children: [{ to: '/statuses', label: 'Statuses', icon: 'list-checks' }],
	},
	{ to: '/contacts', label: 'Contacts', icon: 'contact' },
	{ to: '/properties', label: 'Properties', icon: 'house' },
	{
		to: '/agents',
		label: 'Agents',
		icon: 'users',
		children: [
			{
				to: '/saved-filters',
				label: 'Saved Filters',
				icon: 'filter',
			},
			{
				to: '/team-leaders',
				label: 'Team Leaders',
				icon: 'users',
			},
		],
	},
	{ to: '/groups', label: 'Groups', icon: 'boxes' },
	{ to: '/withdrawals', label: 'Withdrawals', icon: 'wallet' },
	{ to: '/payments', label: 'Payments', icon: 'badge-dollar' },
	{
		to: '/ai-chat',
		label: 'AI Chat',
		icon: 'bot',
		// No page of its own — the parent button jumps to the first child.
		groupOnly: true,
		children: [
			{
				to: '/ai-chat/messages',
				label: 'Messages',
				icon: 'message-square',
			},
			{
				to: '/ai-chat/sessions',
				label: 'Sessions',
				icon: 'users',
			},
		],
	},
	{
		to: '/chats',
		label: 'Chats',
		icon: 'message-square',
		// No page of its own — the parent button jumps to the first child.
		groupOnly: true,
		children: [
			{
				to: '/chats',
				label: 'All Chats',
				icon: 'message-square',
				end: true,
			},
			{
				to: '/chats/messages',
				label: 'Messages',
				icon: 'message-square',
			},
			{ to: '/chats/media', label: 'Media', icon: 'file-text' },
		],
	},
	{
		to: '/journey',
		label: 'Journey',
		icon: 'route',
		// No page of its own — the parent button jumps to the first child.
		groupOnly: true,
		children: [
			{
				to: '/shared-partners',
				label: 'Partners',
				icon: 'building-2',
			},
		],
	},
	{
		// Parent has its own page (/settings — the General singleton); the rest
		// of System (base) hangs off it. `end` so it highlights only on /settings.
		to: '/settings',
		label: 'Settings',
		icon: 'settings',
		end: true,
		children: [
			{ to: '/token-courses', label: 'Token Courses', icon: 'coins' },
			{ to: '/link-names', label: 'Links', icon: 'link' },
			{ to: '/form-configs', label: 'Forms', icon: 'file-text' },
			{
				to: '/group-form-prices',
				label: 'Form Prices',
				icon: 'badge-dollar',
			},
		],
	},
	{
		to: '/logs',
		label: 'Logs',
		icon: 'scroll-text',
		// No page of its own — the parent button jumps to the first child.
		groupOnly: true,
		children: [
			{ to: '/logs', label: 'All Logs', icon: 'scroll-text', end: true },
			{
				to: '/logs/referrals-sent',
				label: 'Referrals Sent',
				icon: 'git-branch',
			},
			{
				to: '/logs/referrals-closed',
				label: 'Referrals Closed',
				icon: 'git-branch',
			},
		],
	},
]

// Persist the desktop collapse preference across reloads.
const COLLAPSED_STORAGE_KEY = 'sidebar:collapsed'

function readStoredCollapsed(): boolean {
	try {
		return localStorage.getItem(COLLAPSED_STORAGE_KEY) === 'true'
	} catch {
		return false
	}
}

export function useAppShell() {
	const location = useLocation()
	const navigate = useNavigate()
	// On mobile we drop the custom (OverlayScrollbars) scroll in favour of the
	// native full-page scroll. Mirror the SCSS breakpoint (md = 768px).
	const isMobile = useMediaQuery('(max-width: 767.98px)')
	// Capture the outlet element so the exiting page keeps its own content
	// during the transition (a live <Outlet /> would render the new route
	// inside the exiting wrapper and cause a flash).
	const outlet = useOutlet()
	const [collapsed, setCollapsed] = useState(readStoredCollapsed)
	const [mobileOpen, setMobileOpen] = useState(false)
	// Accordion-style manual override: at most one group is manually expanded at
	// a time, stamped with the path it was set on. Any navigation (the stamp no
	// longer matching `pathname`) drops the override and falls back to "open the
	// active group", so opened dropdowns never accumulate. `group: ''` means the
	// user explicitly collapsed everything. No override → active-route fallback.
	const [manualGroup, setManualGroup] = useState<{
		path: string
		group: string
	} | null>(null)

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

	// The manual override only applies while we're still on the page where it was
	// set; once `pathname` changes it's stale, so we fall back to the active group.
	const activeManualGroup =
		manualGroup && manualGroup.path === pathname ? manualGroup.group : null

	const isGroupOpen = (item: NavItem) =>
		activeManualGroup !== null
			? item.to === activeManualGroup
			: groupHasActiveRoute(item)

	// Accordion: opening a group makes it the only expanded one; toggling the
	// open group shut collapses everything (`group: ''`).
	const toggleGroup = (item: NavItem) =>
		setManualGroup({
			path: pathname,
			group: isGroupOpen(item) ? '' : item.to,
		})

	// Whether any of a group's routes (parent or child) is the current page —
	// used to highlight a `groupOnly` parent, which has no NavLink of its own.
	const isGroupActive = groupHasActiveRoute

	// Click handler for a `groupOnly` parent: navigate to its first child, since
	// the parent has no page to land on itself. Navigation makes the group the
	// active one, so the active-route fallback expands it (and collapses others).
	const selectGroup = (item: NavItem) => {
		const first = item.children?.[0]
		if (!first) return
		navigate(first.to)
	}

	return {
		pathname,
		outlet,
		isMobile,
		collapsed,
		toggleCollapsed: () =>
			setCollapsed((v) => {
				const next = !v
				try {
					localStorage.setItem(COLLAPSED_STORAGE_KEY, String(next))
				} catch {
					/* ignore storage failures (private mode, quota) */
				}
				return next
			}),
		mobileOpen,
		openMobile: () => setMobileOpen(true),
		closeMobile: () => setMobileOpen(false),
		isGroupOpen,
		toggleGroup,
		isGroupActive,
		selectGroup,
	}
}
