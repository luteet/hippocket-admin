import { forwardRef, type SVGProps } from 'react'

// Every icon available in the sprite. Keep this union in sync with the
// <symbol id="…"> entries in public/img/sprites.svg.
export type IconName =
	| 'search'
	| 'arrow-left'
	| 'arrow-right'
	| 'check'
	| 'plus'
	| 'pencil'
	| 'trash-2'
	| 'circle-check'
	| 'chevron-down'
	| 'chevron-up'
	| 'chevrons-up-down'
	| 'chevron-left'
	| 'chevron-right'
	| 'x'
	| 'menu'
	| 'log-out'
	| 'panel-left-close'
	| 'panel-left-open'
	| 'file-question'
	| 'construction'
	| 'building-2'
	| 'house'
	| 'mail'
	| 'contact'
	| 'users'
	| 'boxes'
	| 'git-branch'
	| 'route'
	| 'list-checks'
	| 'wallet'
	| 'tags'
	| 'layers'
	| 'map-pin'
	| 'wrench'
	| 'loader'
	| 'scroll-text'
	| 'filter'
	| 'calendar'
	| 'message-square'
	| 'bot'
	| 'layout-dashboard'
	| 'settings'
	| 'coins'
	| 'link'
	| 'file-text'
	| 'badge-dollar'
	| 'user'
	| 'upload'
	| 'image'
	| 'grip-vertical'

const SPRITE_URL = `${import.meta.env.BASE_URL}img/sprites.svg`

interface IconProps extends SVGProps<SVGSVGElement> {
	name: IconName
	/** Pixel width/height. Defaults to 24; a CSS size (e.g. `size-4`) wins. */
	size?: number | string
}

/**
 * Renders an icon from the SVG sprite (public/img/sprites.svg):
 *     <Icon name="search" />  →  <svg><use href="/img/sprites.svg#search" /></svg>
 * Color comes from the surrounding `currentColor`; size from `size`/className.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
	({ name, size = 24, ...props }, ref) => (
		<svg
			ref={ref}
			width={size}
			height={size}
			aria-hidden="true"
			focusable="false"
			{...props}
		>
			<use href={`${SPRITE_URL}#${name}`} />
		</svg>
	),
)
Icon.displayName = 'Icon'
