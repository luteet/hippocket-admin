import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

/**
 * Copy text to the clipboard and expose a brief `copied` flag (true for ~1.5s)
 * so a button can swap to a success check. Each call site gets its own hook
 * instance, so the timeout is per-button.
 *
 * Uses the async Clipboard API. If it's unavailable (insecure context — plain
 * http on a LAN IP) or the write is rejected, it surfaces a toast instead of
 * throwing.
 */
export function useCopyToClipboard(resetMs = 1500) {
	const [copied, setCopied] = useState(false)
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(
		() => () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current)
		},
		[],
	)

	const copy = useCallback(
		async (text: string) => {
			if (!navigator.clipboard?.writeText) {
				toast.error('Clipboard is unavailable in this context')
				return
			}
			try {
				await navigator.clipboard.writeText(text)
				setCopied(true)
				if (timeoutRef.current) clearTimeout(timeoutRef.current)
				timeoutRef.current = setTimeout(() => setCopied(false), resetMs)
			} catch {
				toast.error('Failed to copy to clipboard')
			}
		},
		[resetMs],
	)

	return { copy, copied }
}
