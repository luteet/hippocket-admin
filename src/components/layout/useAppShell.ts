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
	// One-line description, shown under the label in the command palette search.
	description?: string
	// Extra search terms (synonyms) so the command palette can match an item by
	// words other than its label, e.g. matching "Segments" on "grouping".
	keywords?: string[]
}

export const NAV_ITEMS: NavItem[] = [
	{
		to: '/',
		label: 'Dashboard',
		icon: 'layout-dashboard',
		end: true,
		description: 'Overview and key metrics',
		keywords: ['home', 'overview', 'metrics', 'stats', 'start'],
	},
	{
		to: '/partners',
		label: 'Partners',
		icon: 'building-2',
		description: 'Manage partner businesses',
		keywords: ['partner', 'business', 'vendor', 'company', 'merchant'],
		children: [
			{
				to: '/categories',
				label: 'Categories',
				icon: 'tags',
				description: 'Granular service categories',
				keywords: ['category', 'taxonomy', 'tag'],
			},
			{
				to: '/segments',
				label: 'Segments',
				icon: 'layers',
				description: 'Broad partner groupings',
				keywords: ['segment', 'grouping', 'partner category'],
			},
			{
				to: '/locations',
				label: 'Locations',
				icon: 'map-pin',
				description: 'Partner locations',
				keywords: ['location', 'place', 'city', 'region'],
			},
			{
				to: '/services',
				label: 'Services',
				icon: 'wrench',
				description: 'Partner services',
				keywords: ['service', 'offering'],
			},
		],
	},
	{
		to: '/referrals',
		label: 'Pipeline',
		icon: 'git-branch',
		description: 'Referral pipeline and deals',
		keywords: ['referral', 'pipeline', 'deal', 'lead'],
		children: [
			{
				to: '/statuses',
				label: 'Statuses',
				icon: 'list-checks',
				description: 'Referral pipeline statuses',
				keywords: ['status', 'stage', 'state'],
			},
		],
	},
	{
		to: '/agents',
		label: 'Agents',
		icon: 'users',
		description: 'Manage agent accounts',
		keywords: ['agent', 'user', 'account', 'people', 'staff'],
		children: [
			{
				to: '/saved-filters',
				label: 'Saved Filters',
				icon: 'filter',
				description: 'Saved agent filters',
				keywords: ['filter', 'saved', 'preset'],
			},
			{
				to: '/team-leaders',
				label: 'Team Leaders',
				icon: 'users',
				description: 'Group team leaders',
				keywords: ['team', 'leader', 'lead', 'manager'],
			},
		],
	},
	{
		to: '/groups',
		label: 'Groups',
		icon: 'boxes',
		description: 'Agent groups',
		keywords: ['group', 'team', 'collection'],
	},
	{
		to: '/contacts',
		label: 'Contacts',
		icon: 'contact',
		description: 'Contact form submissions',
		keywords: ['contact', 'lead', 'inquiry', 'message'],
	},
	{
		to: '/chats',
		label: 'Chats',
		icon: 'message-square',
		description: 'Customer chat threads',
		keywords: ['chat', 'message', 'conversation', 'support'],
		// No page of its own — the parent button jumps to the first child.
		groupOnly: true,
		children: [
			{
				to: '/chats',
				label: 'All Chats',
				icon: 'message-square',
				end: true,
				description: 'All chat threads',
				keywords: ['chat', 'thread'],
			},
			{
				to: '/chats/messages',
				label: 'Messages',
				icon: 'message-square',
				description: 'Chat messages',
				keywords: ['message'],
			},
			{
				to: '/chats/media',
				label: 'Media',
				icon: 'file-text',
				description: 'Chat media files',
				keywords: ['media', 'file', 'attachment', 'image'],
			},
		],
	},
	{
		to: '/ai-chat',
		label: 'AI Chat',
		icon: 'bot',
		description: 'AI assistant conversations',
		keywords: ['ai', 'assistant', 'bot', 'gpt', 'chatbot'],
		// No page of its own — the parent button jumps to the first child.
		groupOnly: true,
		children: [
			{
				to: '/ai-chat/messages',
				label: 'Messages',
				icon: 'message-square',
				description: 'AI chat messages',
				keywords: ['message', 'ai'],
			},
			{
				to: '/ai-chat/sessions',
				label: 'Sessions',
				icon: 'users',
				description: 'AI chat sessions',
				keywords: ['session', 'ai', 'conversation'],
			},
		],
	},
	{
		to: '/properties',
		label: 'Properties',
		icon: 'house',
		description: 'Real-estate properties',
		keywords: ['property', 'listing', 'house', 'real estate', 'home'],
		children: [
			{
				to: '/property-images',
				label: 'Images',
				icon: 'image',
				description: 'Property images',
				keywords: ['image', 'photo', 'picture'],
			},
			{
				to: '/cash-offers-emails',
				label: 'Cash Offers Emails',
				icon: 'mail',
				description: 'Cash-offer emails',
				keywords: ['cash', 'offer', 'email'],
			},
		],
	},
	{
		to: '/journey',
		label: 'Journey',
		icon: 'route',
		description: 'Partner journey',
		keywords: ['journey', 'flow'],
		// No page of its own — the parent button jumps to the first child.
		groupOnly: true,
		children: [
			{
				to: '/shared-partners',
				label: 'Partners',
				icon: 'building-2',
				description: 'Shared partners',
				keywords: ['shared', 'partner'],
			},
		],
	},
	{
		to: '/withdrawals',
		label: 'Withdrawals',
		icon: 'wallet',
		description: 'Agent withdrawal requests',
		keywords: ['withdrawal', 'payout', 'cashout', 'money'],
	},
	{
		to: '/payments',
		label: 'Payments',
		icon: 'badge-dollar',
		description: 'Payment records',
		keywords: ['payment', 'transaction', 'money', 'billing'],
	},
	{
		to: '/transactions',
		label: 'Transactions',
		icon: 'transactions',
		description: 'Real-estate transactions with partner referrals',
		keywords: [
			'transaction',
			'deal',
			'real estate',
			'property',
			'referral',
			'timeline',
		],
	},
	{
		// Parent has its own page (/settings — the General singleton); the rest
		// of System (base) hangs off it. `end` so it highlights only on /settings.
		to: '/settings',
		label: 'Settings',
		icon: 'settings',
		end: true,
		description: 'System settings',
		keywords: ['setting', 'config', 'preferences', 'system'],
		children: [
			{
				to: '/token-courses',
				label: 'Token Courses',
				icon: 'coins',
				description: 'Token course rates',
				keywords: ['token', 'course', 'rate', 'exchange'],
			},
			{
				to: '/link-names',
				label: 'Links',
				icon: 'link',
				description: 'Link names',
				keywords: ['link', 'url'],
			},
			{
				to: '/form-configs',
				label: 'Forms',
				icon: 'file-text',
				description: 'Form configurations',
				keywords: ['form', 'config'],
			},
			{
				to: '/group-form-prices',
				label: 'Form Prices',
				icon: 'badge-dollar',
				description: 'Group form prices',
				keywords: ['price', 'form', 'cost'],
			},
		],
	},
	{
		to: '/logs',
		label: 'Logs',
		icon: 'scroll-text',
		description: 'Audit logs and history',
		keywords: ['log', 'audit', 'history', 'activity'],
		// No page of its own — the parent button jumps to the first child.
		groupOnly: true,
		children: [
			{
				to: '/logs',
				label: 'All Logs',
				icon: 'scroll-text',
				end: true,
				description: 'All audit logs',
				keywords: ['log', 'audit'],
			},
			{
				to: '/logs/referrals-sent',
				label: 'Referrals Sent',
				icon: 'git-branch',
				description: 'Referrals-sent logs',
				keywords: ['referral', 'sent', 'log'],
			},
			{
				to: '/logs/referrals-closed',
				label: 'Referrals Closed',
				icon: 'git-branch',
				description: 'Referrals-closed logs',
				keywords: ['referral', 'closed', 'log'],
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
