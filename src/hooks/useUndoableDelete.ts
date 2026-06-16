import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'

interface Options<T> {
	/** Performs the real deletion (deferred until the undo window closes). */
	delete: (item: T) => Promise<unknown>
	/** Optimistically hide the item; returns a rollback fn that re-inserts it. */
	hide: (item: T) => () => void
	/** Toast text for the deleted item. */
	label?: (item: T) => string
	/** How long the undo window stays open, in ms. */
	windowMs?: number
}

interface Pending {
	timer: ReturnType<typeof setTimeout> | null
	/** Commit immediately (used to flush on unmount). */
	flush: () => void
}

/**
 * Optimistic delete with an Undo toast and **no** confirm modal.
 *
 * The row vanishes immediately and a `sonner` toast offers "Undo" for
 * `windowMs`. The real DELETE request is *deferred* until the window closes —
 * clicking Undo cancels it before it ever fires, so no `restore` endpoint is
 * needed. If the request fails the optimistic change rolls back with an error
 * toast.
 *
 * `hide` should do an optimistic `setQueryData` removal and return a rollback
 * that restores the previous cache (mirrors the optimistic-reorder pattern in
 * statuses/references).
 */
export function useUndoableDelete<T>({
	delete: doDelete,
	hide,
	label = () => 'Item deleted',
	windowMs = 5000,
}: Options<T>) {
	// Track pending deletes so unmount / rapid deletes don't leak timers.
	const pending = useRef(new Set<Pending>())

	const remove = (item: T) => {
		const rollback = hide(item)
		let settled = false

		const entry: Pending = { timer: null, flush: () => {} }

		const commit = async () => {
			if (settled) return
			settled = true
			if (entry.timer) clearTimeout(entry.timer)
			pending.current.delete(entry)
			try {
				await doDelete(item)
			} catch (error) {
				rollback()
				toast.error(getApiErrorMessage(error, 'Failed to delete'))
			}
		}

		const undo = () => {
			if (settled) return
			settled = true
			if (entry.timer) clearTimeout(entry.timer)
			pending.current.delete(entry)
			rollback()
		}

		entry.flush = commit
		entry.timer = setTimeout(commit, windowMs)
		pending.current.add(entry)

		toast(label(item), {
			duration: windowMs,
			action: { label: 'Undo', onClick: undo },
			actionButtonStyle: { backgroundColor: 'var(--secondary)' },
		})
	}

	// On unmount, flush any pending deletes (commit immediately) so a
	// navigate-away during the undo window commits the delete rather than
	// silently dropping it.
	useEffect(() => {
		const set = pending.current
		return () => {
			set.forEach((entry) => entry.flush())
		}
	}, [])

	return { remove }
}
