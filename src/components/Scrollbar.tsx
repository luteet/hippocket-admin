import { type ElementType } from 'react'
import {
	OverlayScrollbarsComponent,
	type OverlayScrollbarsComponentProps,
} from 'overlayscrollbars-react'

// Thin wrapper around OverlayScrollbars with the project defaults.
// Visual styling (10px width, gradient handle) lives in src/styles/main.scss
// under the `os-theme-hp` theme.
export function Scrollbar<T extends ElementType = 'div'>({
	options,
	...props
}: OverlayScrollbarsComponentProps<T>) {
	return (
		<OverlayScrollbarsComponent
			defer
			options={{
				scrollbars: {
					theme: 'os-theme-hp',
					autoHide: 'leave',
					autoHideDelay: 400,
				},
				...options,
			}}
			{...(props as OverlayScrollbarsComponentProps)}
		/>
	)
}
