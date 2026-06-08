import type { ReactNode } from 'react'

import { Separator } from '@/components/ui/separator'
import {
	DetailGrid,
	DetailRow,
	type DetailField,
} from '@/components/DetailList'

/** The big title block at the top of a detail card: name, optional muted
 *  subtitle, and an optional right-aligned status badge. */
export interface DetailHeading {
	title: ReactNode
	subtitle?: ReactNode
	badge?: ReactNode
	/** Optional leading visual (e.g. an avatar/logo thumbnail). */
	avatar?: ReactNode
}

export interface DetailBodyProps {
	/** Standard big-title heading block. */
	heading?: DetailHeading
	/** A fully custom header row, used instead of `heading` (e.g. a compact
	 *  badge row). Takes precedence over `heading`. */
	header?: ReactNode
	/** Extra content under the header, before the separator (e.g. a description
	 *  paragraph). */
	intro?: ReactNode
	/** Rows rendered as a {@link DetailGrid}. */
	fields?: DetailField[]
	/** Extra content after the grid (status changer, file lists, …). */
	children?: ReactNode
}

/**
 * The inner body of a detail card: an optional header block, an optional intro,
 * a separator, the {@link DetailGrid} built from `fields`, and any extra
 * `children`. Used directly by {@link DetailPage} for single-card pages and
 * passed as a tab's `content` for tabbed ones.
 */
export function DetailBody({
	heading,
	header,
	intro,
	fields,
	children,
}: DetailBodyProps) {
	const hasHead = Boolean(header || heading)
	const rows = fields?.filter((f) => !f.hidden) ?? []

	return (
		<div className="space-y-4">
			{header ??
				(heading && (
					<div className="flex items-center justify-between gap-4">
						<div className="flex items-center gap-4">
							{heading.avatar}
							<div>
								<p className="text-xl font-semibold">
									{heading.title}
								</p>
								{heading.subtitle != null &&
									heading.subtitle !== '' && (
										<p className="pt-2 text-sm font-medium text-muted-foreground">
											{heading.subtitle}
										</p>
									)}
							</div>
						</div>
						{heading.badge}
					</div>
				))}

			{intro}

			{hasHead && rows.length > 0 && <Separator className="mt-8" />}

			{rows.length > 0 && (
				<DetailGrid className={hasHead ? 'mt-8' : undefined}>
					{rows.map((f, i) => (
						<DetailRow
							key={i}
							label={f.label}
							value={
								typeof f.value === 'number'
									? String(f.value)
									: f.value
							}
							bool={f.bool}
							capitalize={f.capitalize}
						>
							{f.render}
						</DetailRow>
					))}
				</DetailGrid>
			)}

			{children}
		</div>
	)
}
