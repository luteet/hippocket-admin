import { useState, type ReactNode } from 'react'
import { AnimatePresence } from 'motion/react'

import type { IconName } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageTransition } from '@/components/PageTransition'
import { Reveal } from '@/components/Reveal'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { TabButton } from '@/components/TabButton'
import type { DetailField } from '@/components/DetailList'
import { DetailBody, type DetailHeading } from './DetailBody'
import {
	DetailHeaderButton,
	type DetailButtonVariant,
} from './DetailHeaderButton'
import { useDetailPageContext } from './DetailPageContext'

/** An extra header action between the Back and Delete buttons. */
export interface DetailAction {
	label: string
	icon: IconName
	onClick: () => void
	variant?: DetailButtonVariant
}

export interface DetailTab {
	key: string
	label: ReactNode
	/** This tab's body. For carded tabs it's wrapped in the shared Card with the
	 *  loading skeleton; for `bare` tabs it's rendered as-is. */
	content: ReactNode
	/** Render `content` directly, without the wrapping Card (the tab is its own
	 *  self-contained component, e.g. a nested list). */
	bare?: boolean
}

interface DetailPageProps {
	/** Page H1, e.g. "Partner". */
	title: string

	// --- context-provided props (all optional; fall back to DetailPageContext) ---
	onBack?: () => void

	/** Whether the record has loaded. Gates the action buttons and the body. */
	ready?: boolean
	isLoading?: boolean

	// --- header actions (shown when `ready`) ---
	/** Adds the standard Edit button (secondary, pencil). */
	onEdit?: () => void
	/** Extra buttons inserted between Edit and Delete. */
	actions?: DetailAction[]
	/** Adds the Delete button; the shell owns the confirm dialog. */
	onDelete?: () => void
	deleteTitle?: string
	deleteDescription?: string
	isDeleting?: boolean

	// --- single-card body (omit when using `tabs`) ---
	heading?: DetailHeading
	header?: ReactNode
	intro?: ReactNode
	fields?: DetailField[]
	children?: ReactNode
	/** Shown instead of the body when loaded but the record is missing. */
	notFound?: ReactNode

	// --- tabbed body ---
	tabs?: DetailTab[]
	activeTab?: string
	onTabChange?: (key: string) => void

	/** Card width utility; defaults to `max-w-2xl`. */
	maxWidth?: string
}

const SKELETON = (
	<div className="space-y-3">
		<Skeleton className="h-6 w-1/2" />
		<Skeleton className="h-5 w-2/3" />
		<Skeleton className="h-5 w-1/3" />
	</div>
)

/**
 * The shared shell for every detail page: a header (Back / Edit / extra actions /
 * Delete), a Card with the standard loading skeleton, and a delete confirm
 * dialog whose open state it owns. The body is either a single card built from
 * `heading`/`fields`/`children` or a set of `tabs`. Page-specific config (which
 * fields, which badge, custom body) stays in the page file; this owns the chrome.
 */
export function DetailPage({
	title,
	onBack: onBackProp,
	ready: readyProp,
	isLoading: isLoadingProp,
	onEdit: onEditProp,
	actions: actionsProp,
	onDelete: onDeleteProp,
	deleteTitle = 'Delete?',
	deleteDescription,
	isDeleting: isDeletingProp,
	heading,
	header,
	intro,
	fields,
	children,
	notFound,
	tabs,
	activeTab: activeTabProp,
	onTabChange: onTabChangeProp,
	maxWidth = 'max-w-2xl',
}: DetailPageProps) {
	const ctx = useDetailPageContext()

	// Props take precedence; fall back to context values (if any).
	const onBack = onBackProp ?? ctx?.onBack ?? (() => {})
	const ready = readyProp ?? ctx?.ready
	const isLoading = isLoadingProp ?? ctx?.isLoading
	const onEdit = onEditProp ?? ctx?.onEdit
	const actions = actionsProp ?? ctx?.actions
	const onDelete = onDeleteProp ?? ctx?.onDelete
	const isDeleting = isDeletingProp ?? ctx?.isDeleting
	const activeTab = activeTabProp ?? ctx?.activeTab
	const onTabChange = onTabChangeProp ?? ctx?.onTabChange
	const [confirmOpen, setConfirmOpen] = useState(false)

	const carded = (content: ReactNode) => (
		<Card className={maxWidth}>
			<CardContent className="pt-6">
				{/* Re-keyed on the loading→ready swap so the skeleton→content
				    transition replays the fade (same trick as DataTable's tbody). */}
				<div
					key={isLoading ? 'loading' : 'ready'}
					className="detail-fade"
				>
					{isLoading
						? SKELETON
						: !ready
							? (notFound ?? SKELETON)
							: content}
				</div>
			</CardContent>
		</Card>
	)

	const activeTabDef = tabs?.find((t) => t.key === activeTab)

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title={title}
					actions={
						<>
							<DetailHeaderButton
								label="Back"
								icon="arrow-left"
								variant="outline"
								onClick={onBack}
							/>
							{ready && (
								<>
									{onEdit && (
										<DetailHeaderButton
											label="Edit"
											icon="pencil"
											variant="secondary"
											onClick={onEdit}
										/>
									)}
									{actions?.map((a) => (
										<DetailHeaderButton
											key={a.label}
											label={a.label}
											icon={a.icon}
											variant={a.variant ?? 'secondary'}
											onClick={a.onClick}
										/>
									))}
									{onDelete && (
										<DetailHeaderButton
											label="Delete"
											icon="trash-2"
											variant="destructive"
											onClick={() => setConfirmOpen(true)}
										/>
									)}
								</>
							)}
						</>
					}
				/>
			</Reveal>

			{tabs ? (
				<Reveal index={1}>
					<div className="mb-6 flex gap-1 border-b border-border">
						{tabs.map((t) => (
							<TabButton
								key={t.key}
								active={activeTab === t.key}
								onClick={() => onTabChange?.(t.key)}
							>
								{t.label}
							</TabButton>
						))}
					</div>

					<AnimatePresence mode="wait" initial={false}>
						<PageTransition key={activeTab}>
							{activeTabDef &&
								(activeTabDef.bare
									? activeTabDef.content
									: carded(activeTabDef.content))}
						</PageTransition>
					</AnimatePresence>
				</Reveal>
			) : (
				// The `carded` wrapper owns the entrance fade (Reveal would
				// stack a second opacity animation on the same content).
				carded(
					<DetailBody
						heading={heading}
						header={header}
						intro={intro}
						fields={fields}
					>
						{children}
					</DetailBody>,
				)
			)}

			{onDelete && (
				<ConfirmDialog
					open={confirmOpen}
					onOpenChange={setConfirmOpen}
					title={deleteTitle}
					description={deleteDescription}
					confirmLabel="Delete"
					destructive
					loading={isDeleting}
					onConfirm={onDelete}
				/>
			)}
		</div>
	)
}
