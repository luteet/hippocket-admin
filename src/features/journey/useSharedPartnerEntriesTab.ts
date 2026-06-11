import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useUndoableDelete } from '@/hooks/useUndoableDelete'
import type { SharedPartner, SharedPartnerEntry } from '@/types/api'
import { useDeleteSharedPartnerEntry, SHARED_KEY } from './hooks'

/** Keep a row's action buttons from also triggering the row's edit click. */
export const stopRowClick = (e: { stopPropagation: () => void }) =>
	e.stopPropagation()

export function useSharedPartnerEntriesTab(sharedId: string) {
	const qc = useQueryClient()
	const deleteMut = useDeleteSharedPartnerEntry(sharedId)

	const [dialogOpen, setDialogOpen] = useState(false)
	const [editing, setEditing] = useState<SharedPartnerEntry | null>(null)

	const openCreate = () => {
		setEditing(null)
		setDialogOpen(true)
	}

	const openEdit = (entry: SharedPartnerEntry) => {
		setEditing(entry)
		setDialogOpen(true)
	}

	// Entries live inside the shared-partner detail cache; hide one by dropping
	// it from that record's `entries` array (the detail page re-passes it down).
	const detailKey = [SHARED_KEY, 'detail', sharedId]
	const { remove: deleteEntry } = useUndoableDelete<SharedPartnerEntry>({
		delete: (entry) => deleteMut.mutateAsync(entry.id),
		hide: (entry) => {
			const prev = qc.getQueryData<SharedPartner>(detailKey)
			qc.setQueryData<SharedPartner>(detailKey, (cur) =>
				cur
					? {
							...cur,
							entries: cur.entries.filter(
								(e) => e.id !== entry.id,
							),
						}
					: cur,
			)
			return () => qc.setQueryData(detailKey, prev)
		},
		label: (entry) => `Removed ${entry.partner_name}`,
	})

	return {
		dialogOpen,
		setDialogOpen,
		editing,
		openCreate,
		openEdit,
		deleteEntry,
	}
}
