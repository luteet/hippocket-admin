import { type ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { Icon } from '@/components/Icon'

/**
 * Declarative config for one {@link DetailRow}, consumed by `<DetailBody>` /
 * `<DetailPage>` so a page can render its grid from a plain array. Pass `value`
 * for a string/number (nullish renders an em dash), `bool` for a check/dash,
 * `render` for fully custom content, `hidden` to skip the row entirely.
 */
export interface DetailField {
	label: string
	value?: string | number | null
	bool?: boolean
	capitalize?: boolean
	render?: ReactNode
	hidden?: boolean
}

/**
 * A `<dl>` of label/value pairs, shared by the detail views (partner, agent,
 * referral). Default layout is the roomy single-/two-column grid used on full
 * pages; pass `dense` for the tighter always-two-column layout used inside
 * dialogs.
 */
export function DetailGrid({
	dense,
	className,
	children,
}: {
	dense?: boolean
	className?: string
	children: ReactNode
}) {
	return (
		<dl
			className={cn(
				'grid gap-x-4 text-sm',
				dense
					? 'grid-cols-2 gap-y-3'
					: 'grid-cols-1 gap-y-8 sm:grid-cols-2',
				className,
			)}
		>
			{children}
		</dl>
	)
}

/**
 * One label/value pair inside a {@link DetailGrid}. Pass `value` for a string
 * (empty/nullish renders an em dash), `bool` to render a check-icon / dash, or
 * `children` for fully custom content. `capitalize` title-cases the value.
 */
export function DetailRow({
	label,
	value,
	bool,
	capitalize,
	children,
}: {
	label: string
	value?: string | null
	bool?: boolean
	capitalize?: boolean
	children?: ReactNode
}) {
	return (
		<div>
			<dt className="text-xs text-muted-foreground">{label}</dt>
			<dd
				className={cn(
					'pt-1 wrap-break-word',
					capitalize && 'capitalize',
				)}
			>
				{children ??
					(bool !== undefined ? (
						bool ? (
							<Icon
								name="circle-check"
								className="size-5 text-emerald-600"
							/>
						) : (
							<span className="text-muted-foreground">—</span>
						)
					) : (
						value || '—'
					))}
			</dd>
		</div>
	)
}
