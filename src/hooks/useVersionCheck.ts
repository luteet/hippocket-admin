import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

// How often to re-check for a new deployment while the tab stays open.
const POLL_INTERVAL = 2 * 60 * 1000 // 2 minutes

// Resolved against Vite's base path so it survives a non-root deploy.
const VERSION_URL = `${import.meta.env.BASE_URL}version.json`

// Stable toast id so repeated checks update the same plate instead of stacking.
const TOAST_ID = 'app-update'

/**
 * Polls the deployed `version.json` and, once it no longer matches the build
 * the client is running (`__APP_VERSION__`), shows a persistent toast offering
 * to reload the page. Mounted once at the app root.
 *
 * No-op in dev — `version.json` is only emitted by the production build.
 */
export function useVersionCheck() {
	const notified = useRef(false)

	useEffect(() => {
		if (import.meta.env.DEV) return

		let cancelled = false

		async function check() {
			if (notified.current || cancelled) return
			try {
				const res = await fetch(VERSION_URL, { cache: 'no-store' })
				if (!res.ok) return
				const { version } = (await res.json()) as { version?: string }
				if (cancelled || !version || version === __APP_VERSION__) return

				notified.current = true
				toast('A new version is available', {
					id: TOAST_ID,
					description:
						'Refresh the page to get the latest updates.',
					duration: Infinity,
					action: {
						label: 'Refresh',
						onClick: () => window.location.reload(),
					},
					actionButtonStyle: {
						background: 'var(--secondary)',
						color: 'var(--secondary-foreground)',
						borderRadius: 'var(--pill)',
					},
				})
			} catch {
				// Network hiccup — ignore and retry on the next tick.
			}
		}

		const interval = setInterval(check, POLL_INTERVAL)
		const onVisible = () => {
			if (document.visibilityState === 'visible') check()
		}
		document.addEventListener('visibilitychange', onVisible)
		window.addEventListener('focus', check)

		// Catch a deploy that landed between the cached index.html and now.
		check()

		return () => {
			cancelled = true
			clearInterval(interval)
			document.removeEventListener('visibilitychange', onVisible)
			window.removeEventListener('focus', check)
		}
	}, [])
}
