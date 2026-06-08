import type { CSSProperties, ReactNode } from 'react'

import { cn } from '@/lib/utils'

// Fades its content in on mount, delayed by `index` so a page's blocks (header,
// content) appear one after another. CSS-driven (see `.reveal` in _reveal.scss)
// rather than motion: pages render inside an <AnimatePresence initial={false}>,
// whose PresenceContext would otherwise suppress a nested motion mount animation.
export function Reveal({
	index = 0,
	className,
	children,
}: {
	index?: number
	className?: string
	children: ReactNode
}) {
	return (
		<div
			className={cn('reveal', className)}
			style={{ '--reveal-delay': `${index * 0.02}s` } as CSSProperties}
		>
			{children}
		</div>
	)
}
