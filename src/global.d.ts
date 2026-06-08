// Injected at build time by `define` in vite.config.ts — identifies the build
// the client is currently running. Compared against the deployed
// `version.json` to detect stale builds (see `useVersionCheck`).
declare const __APP_VERSION__: string
