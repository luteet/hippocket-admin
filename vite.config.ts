import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// A unique value per production build. Prefer an injected git SHA when present
// (set GIT_SHA in CI), otherwise fall back to the build timestamp.
const appVersion = process.env.GIT_SHA ?? Date.now().toString(36)

// Emit a `version.json` at the dist root so the running app can poll it and
// detect when a newer build has been deployed (see `useVersionCheck`).
function versionFilePlugin(): Plugin {
	return {
		name: 'app-version-json',
		generateBundle() {
			this.emitFile({
				type: 'asset',
				fileName: 'version.json',
				source: JSON.stringify({ version: appVersion }),
			})
		},
	}
}

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss(), versionFilePlugin()],
	define: {
		__APP_VERSION__: JSON.stringify(appVersion),
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
})
