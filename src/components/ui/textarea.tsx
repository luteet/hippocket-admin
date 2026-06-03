import {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useLayoutEffect,
	useRef,
	type ComponentProps,
} from 'react'

import { cn } from '@/lib/utils'

// Autosizing textarea: height tracks content. CSS keeps a min-height and hides
// the scrollbar (see `.textarea` in _textarea.scss).
const Textarea = forwardRef<HTMLTextAreaElement, ComponentProps<'textarea'>>(
	({ className, onInput, ...props }, ref) => {
		const innerRef = useRef<HTMLTextAreaElement>(null)
		useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement)

		const resize = useCallback(() => {
			const el = innerRef.current
			if (!el) return
			el.style.height = 'auto'
			el.style.height = `${el.scrollHeight}px`
		}, [])

		// Re-measure on every render so programmatic value changes
		// (e.g. react-hook-form `reset` on the edit page) also adjust height.
		useLayoutEffect(resize)

		return (
			<textarea
				className={cn('textarea', className)}
				ref={innerRef}
				onInput={(e) => {
					resize()
					onInput?.(e)
				}}
				{...props}
			/>
		)
	},
)
Textarea.displayName = 'Textarea'

export { Textarea }
