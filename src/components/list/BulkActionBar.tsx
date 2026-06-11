import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { Icon, type IconName } from '@/components/Icon'
import { ConfirmDialog } from '@/components/ConfirmDialog'

export interface BulkAction {
	label: string
	icon?: IconName
	/** Render as the destructive button variant (red). */
	destructive?: boolean
	/**
	 * When set, the action asks for confirmation before running. Required for
	 * higher-stakes bulk ops (delete, status changes, mark-paid) per the
	 * data-safety rule — bulk writes hit many real records at once.
	 */
	confirm?: { title: string; description?: string; confirmLabel?: string }
	onRun: () => void
}

/**
 * Floating sticky action bar shown while a row selection exists, modeled on the
 * Partners save-bar. Lives in `ListPage`'s `footer` slot; gate the page's
 * `pb-24` on `count > 0` so the bar never covers the last row. Actions with a
 * `confirm` config open a {@link ConfirmDialog} (count baked into the copy by
 * the caller) before running.
 */
export function BulkActionBar({
	count,
	actions,
	onClear,
	isRunning,
}: {
	count: number
	actions: BulkAction[]
	onClear: () => void
	isRunning?: boolean
}) {
	const [confirming, setConfirming] = useState<number | null>(null)

	const handleClick = (index: number) => {
		if (actions[index].confirm) setConfirming(index)
		else actions[index].onRun()
	}

	const pending = confirming === null ? null : actions[confirming]

	return (
		<>
			<AnimatePresence>
				{count > 0 && (
					<motion.div
						initial={{ opacity: 0, x: '-50%', y: 24 }}
						animate={{ opacity: 1, x: '-50%', y: 0 }}
						exit={{ opacity: 0, x: '-50%', y: 24 }}
						transition={{ duration: 0.2, ease: 'easeOut' }}
						className="fixed bottom-6 left-1/2 z-50 min-w-64"
					>
						<div className="flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-border bg-card px-5 py-3 shadow-lg">
							<span className="block w-full text-center text-sm text-muted-foreground sm:text-start sm:w-auto sm:inline">
								{count} selected
							</span>
							{actions.map((action, index) => (
								<Button
									key={action.label}
									size="sm"
									variant={
										action.destructive
											? 'destructive'
											: 'outline'
									}
									onClick={() => handleClick(index)}
									disabled={isRunning}
								>
									{action.icon && <Icon name={action.icon} />}
									{action.label}
								</Button>
							))}
							<Button
								size="sm"
								variant="ghost"
								onClick={onClear}
								disabled={isRunning}
							>
								Clear
							</Button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<ConfirmDialog
				open={pending !== null}
				onOpenChange={(open) => {
					if (!open) setConfirming(null)
				}}
				title={pending?.confirm?.title ?? ''}
				description={pending?.confirm?.description}
				confirmLabel={pending?.confirm?.confirmLabel}
				destructive={pending?.destructive}
				loading={isRunning}
				onConfirm={() => {
					pending?.onRun()
					setConfirming(null)
				}}
			/>
		</>
	)
}
