import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface TextTruncateProps {
	children: ReactNode
	className?: string
	as?: 'span' | 'div'
}

/**
 * Renders its children as a single-line text block that truncates with an
 * ellipsis (`…`) when it overflows its container. No line-wrapping occurs.
 *
 * The native `title` attribute is set automatically from the text content so
 * the full value appears as a tooltip on hover.
 */
export function TextTruncate({
	children,
	className,
	as: Tag = 'span',
}: TextTruncateProps) {
	const text =
		typeof children === 'string' || typeof children === 'number'
			? String(children)
			: undefined

	return (
		<Tag
			title={text}
			className={cn(
				'block truncate', // truncate = overflow-hidden text-ellipsis whitespace-nowrap
				className,
			)}
		>
			{children}
		</Tag>
	)
}
