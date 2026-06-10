import { type ComponentProps } from 'react'

import { cn } from '@/lib/utils'

// `stickyHeader` (default on) makes the wrapper a bounded scroll container so
// the <thead> can stick to its top while the body scrolls — see
// `src/styles/components/_table.scss`. Pass `false` to opt a short embedded
// table out and fall back to plain horizontal-only scrolling.
function Table({
	className,
	stickyHeader = true,
	...props
}: ComponentProps<'table'> & { stickyHeader?: boolean }) {
	return (
		<div
			className={cn(
				'relative w-full',
				stickyHeader ? 'table-scroll' : 'overflow-x-auto',
			)}
		>
			<table
				className={cn('w-full caption-bottom text-sm', className)}
				{...props}
			/>
		</div>
	)
}

function TableHeader({ className, ...props }: ComponentProps<'thead'>) {
	return <thead className={cn('[&_tr]:border-b', className)} {...props} />
}

function TableBody({ className, ...props }: ComponentProps<'tbody'>) {
	return (
		<tbody
			className={cn('[&_tr:last-child]:border-0', className)}
			{...props}
		/>
	)
}

function TableRow({ className, ...props }: ComponentProps<'tr'>) {
	return (
		<tr
			className={cn(
				'first:last:border-b-0 border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
				className,
			)}
			{...props}
		/>
	)
}

function TableHead({ className, ...props }: ComponentProps<'th'>) {
	return (
		<th
			className={cn(
				'h-10 px-3 text-left align-middle text-xs font-semibold uppercase tracking-wide text-muted-foreground [&:has([role=checkbox])]:pr-0',
				className,
			)}
			{...props}
		/>
	)
}

function TableCell({ className, ...props }: ComponentProps<'td'>) {
	return (
		<td
			className={cn(
				'p-3 align-middle [&:has([role=checkbox])]:pr-0',
				className,
			)}
			{...props}
		/>
	)
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
