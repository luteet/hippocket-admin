import { useState } from 'react'
import { useLocation, useOutlet } from 'react-router'
import {
	Building2,
	Users,
	Boxes,
	GitBranch,
	ListChecks,
	Wallet,
	Tags,
	MapPin,
	Wrench,
	type LucideIcon,
} from 'lucide-react'

import { useAuth } from '@/features/auth/AuthContext'

// A single navigation entry. A `children` array turns it into a WordPress-style
// group: the parent stays a real link to its own page, with the related
// taxonomies/sections nested underneath and collapsible.
export type NavItem = {
	to: string
	label: string
	icon: LucideIcon
	children?: NavItem[]
}

export const NAV_ITEMS: NavItem[] = [
	{
		to: '/partners',
		label: 'Partners',
		icon: Building2,
		children: [
			{ to: '/categories', label: 'Categories', icon: Tags },
			{ to: '/locations', label: 'Locations', icon: MapPin },
			{ to: '/services', label: 'Services', icon: Wrench },
		],
	},
	{ to: '/referrals', label: 'Pipeline Logs', icon: GitBranch },
	{ to: '/agents', label: 'Agents', icon: Users },
	{ to: '/groups', label: 'Groups', icon: Boxes },
	{ to: '/statuses', label: 'Statuses', icon: ListChecks },
	{ to: '/withdrawals', label: 'Withdrawals', icon: Wallet },
]

export function useAppShell() {
	const { logout } = useAuth()
	const location = useLocation()
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
