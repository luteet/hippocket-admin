import { type ComponentProps } from 'react'

import { cn } from '@/lib/utils'

function Card({ className, ...props }: ComponentProps<'div'>) {
	return (
		<div
			className={cn('card-surface text-card-foreground', className)}
			{...props}
		/>
	)
}

function CardHeader({ className, ...props }: ComponentProps<'div'>) {
	return (
		<div
			className={cn('flex flex-col gap-1.5 p-12 pb-6', className)}
			{...props}
		/>
	)
}

function CardTitle({ className, ...props }: ComponentProps<'div'>) {
	return (
		<div
			className={cn(
				'font-semibold leading-none tracking-tight',
				className,
			)}
			{...props}
		/>
	)
}

function CardDescription({ className, ...props }: ComponentProps<'div'>) {
	return (
		<div
			className={cn('text-sm text-muted-foreground', className)}
			{...props}
		/>
	)
}

function CardContent({ className, ...props }: ComponentProps<'div'>) {
	return <div className={cn('p-6 sm:p-12', className)} {...props} />
}

function CardFooter({ className, ...props }: ComponentProps<'div'>) {
	return (
		<div
			className={cn('flex items-center p-6 pt-0', className)}
			{...props}
		/>
	)
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
