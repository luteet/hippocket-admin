import { Suspense, useState } from 'react'
import { NavLink, useLocation, useOutlet } from 'react-router'
import { AnimatePresence } from 'motion/react'
import {
	Building2,
	Users,
	Boxes,
	GitBranch,
	ListChecks,
	Wallet,
	LogOut,
	Menu,
	X,
	PanelLeftClose,
	PanelLeftOpen,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/PageTransition'
import { PageFallback } from '@/components/PageFallback'
import { Scrollbar } from '@/components/Scrollbar'
import { useAuth } from '@/features/auth/AuthContext'

const NAV_ITEMS = [
	{ to: '/partners', label: 'Partners', icon: Building2 },
	{ to: '/referrals', label: 'Referrals', icon: GitBranch },
	{ to: '/agents', label: 'Agents', icon: Users },
	{ to: '/groups', label: 'Groups', icon: Boxes },
	{ to: '/statuses', label: 'Statuses', icon: ListChecks },
	{ to: '/withdrawals', label: 'Withdrawals', icon: Wallet },
]

export function AppShell() {
	const { logout } = useAuth()
	const location = useLocation()
	// Capture the outlet element so the exiting page keeps its own content
	// during the transition (a live <Outlet /> would render the new route
	// inside the exiting wrapper and cause a flash).
	const outlet = useOutlet()
	const [collapsed, setCollapsed] = useState(false)
	const [mobileOpen, setMobileOpen] = useState(false)

	const closeMobile = () => setMobileOpen(false)

	return (
		<div className="flex h-dvh gap-2.5 overflow-hidden pl-2.5 md:gap-12 lg:gap-25">
			{/* Mobile backdrop */}
			<div
				onClick={closeMobile}
				className={cn(
					'fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden',
					mobileOpen
						? 'opacity-100'
						: 'pointer-events-none opacity-0',
				)}
			/>

			{/* Sidebar */}
			<aside
				className={cn(
					'z-50 h-[100%-20px] overflow-auto flex shrink-0 flex-col rounded-pill bg-sidebar text-sidebar-foreground transition-all duration-300 md:my-2.5',
					collapsed ? 'md:w-20' : 'md:w-45',
					// Mobile: fixed slide-in drawer
					'max-md:fixed max-md:inset-y-2.5 max-md:left-2.5 max-md:w-50',
					mobileOpen
						? 'max-md:translate-x-0'
						: 'max-md:-translate-x-[110%]',
				)}
			>
				{/* Header: brand + toggles */}
				<div
					className={cn(
						'flex min-h-16 items-center gap-2 px-4',
						collapsed && 'md:justify-center md:px-0',
					)}
				>
					{!collapsed && (
						<span className="flex-1 truncate text-lg font-semibold">
							HipPocket
						</span>
					)}
					{/* Desktop collapse toggle */}
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setCollapsed((v) => !v)}
						aria-label="Toggle sidebar"
						className="hidden size-9 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground md:inline-flex"
					>
						{collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
					</Button>
					{/* Mobile close */}
					<Button
						variant="ghost"
						size="icon"
						onClick={closeMobile}
						aria-label="Close menu"
						className="ml-auto text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground md:hidden"
					>
						<X />
					</Button>
				</div>

				<nav className="flex-1 space-y-1 px-3">
					{NAV_ITEMS.map(({ to, label, icon: Icon }) => (
						<NavLink
							key={to}
							to={to}
							onClick={closeMobile}
							className={({ isActive }) =>
								cn(
									'flex items-center gap-3 rounded-pill px-3 py-3 text-sm font-medium transition-colors',
									collapsed && 'md:justify-center md:px-0',
									isActive
										? 'bg-sidebar-primary text-sidebar-primary-foreground'
										: 'text-sidebar-foreground/90 hover:bg-sidebar-accent',
								)
							}
						>
							<Icon className="size-5 shrink-0" />
							<span className={cn(collapsed && 'md:hidden')}>
								{label}
							</span>
						</NavLink>
					))}
				</nav>

				{/* Logout */}
				<div className="p-3">
					<Button
						variant="ghost"
						onClick={logout}
						className={cn(
							'w-full gap-3 text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-foreground',
							collapsed
								? 'md:justify-center md:px-0'
								: 'justify-start',
						)}
					>
						<LogOut className="size-5 shrink-0" />
						<span className={cn(collapsed && 'md:hidden')}>
							Sign out
						</span>
					</Button>
				</div>
			</aside>

			{/* Content */}
			<div className="flex min-w-0 flex-1 flex-col">
				{/* Mobile top bar */}
				<header className="flex h-12 items-center gap-2 pt-2.5 md:hidden">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setMobileOpen(true)}
						aria-label="Open menu"
					>
						<Menu />
					</Button>
					<span className="text-lg font-semibold text-secondary">
						HipPocket
					</span>
				</header>

				<Scrollbar element="main" className="min-h-0 flex-1">
					{/* Padding on the inner wrapper (not the OS host) so the
					    bottom/right spacing is part of the scroll flow. */}
					<div className="py-5 pr-2.5 md:pr-12 lg:pr-25">
						<Suspense fallback={<PageFallback />}>
							<AnimatePresence mode="wait" initial={false}>
								<PageTransition key={location.pathname}>
									{outlet}
								</PageTransition>
							</AnimatePresence>
						</Suspense>
					</div>
				</Scrollbar>
			</div>
		</div>
	)
}
