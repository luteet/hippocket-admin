import type { ReactNode } from 'react'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface FormPageProps {
	/** Page H1, e.g. "New status" / "Edit status". */
	title: string
	onBack: () => void
	/** Edit pages load the record async; create pages omit both of these. */
	isLoading?: boolean
	/** `false` once loaded but the record is missing. Defaults to ready. */
	ready?: boolean
	/** Shown instead of the form when loaded but the record is missing. */
	notFound?: ReactNode
	/** The form (typically a `<FormLayout>`). */
	children: ReactNode
	maxWidth?: string
}

const FORM_SKELETON = (
	<div className="space-y-3">
		<Skeleton className="h-12 w-full" />
		<Skeleton className="h-12 w-full" />
		<Skeleton className="h-12 w-2/3" />
	</div>
)

/**
 * The shared shell for every create/edit page: a header with a Back button and a
 * Card holding the form. Edit pages pass `isLoading`/`ready` to get the standard
 * loading skeleton and not-found handling; create pages pass neither. Mirrors
 * {@link DetailPage} for the read views.
 */
export function FormPage({
	title,
	onBack,
	isLoading,
	ready,
	notFound,
	children,
	maxWidth = 'max-w-2xl',
}: FormPageProps) {
	const showSkeleton = isLoading || (ready === false && !notFound)
	const showNotFound = !isLoading && ready === false && !!notFound

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title={title}
					actions={
						<Button
							variant="outline"
							onClick={onBack}
							aria-label="Back"
						>
							<Icon name="arrow-left" />
							<span className="sm:inline hidden">Back</span>
						</Button>
					}
				/>
			</Reveal>

			<Card className={maxWidth}>
				<CardContent className="pt-6">
					{showSkeleton ? (
						FORM_SKELETON
					) : showNotFound ? (
						notFound
					) : (
						<Reveal index={1}>{children}</Reveal>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
