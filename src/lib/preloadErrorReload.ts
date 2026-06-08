// Guards against the "stale build" race: when a new build is deployed, the
// already-loaded index.html still references lazy chunks by their old hashed
// names. Navigating to a route that triggers such a `import()` then fails with
// "Failed to fetch dynamically imported module". Vite emits a `vite:preloadError`
// window event for exactly this case — we swallow it and reload to pull the
// fresh index.html (and the new chunk names with it).
//
// A short timestamp guard prevents a reload loop when the failure is a genuine
// network error rather than a stale build (a reload wouldn't fix that).
const RELOAD_KEY = 'vite:preload-reload-at'
const RELOAD_COOLDOWN = 10_000 // ms

export function setupPreloadErrorReload() {
	window.addEventListener('vite:preloadError', (event) => {
		event.preventDefault()

		const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0)
		if (Date.now() - last < RELOAD_COOLDOWN) return // just tried — avoid a loop

		sessionStorage.setItem(RELOAD_KEY, String(Date.now()))
		window.location.reload()
	})
}
