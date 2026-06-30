import type { ReactNode } from 'react'

interface PageHeaderProps {
	title: string
	description?: string
	actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
	return (
		<div className="mb-6 flex flex-wrap items-start justify-between gap-4">
			<div>
				<h1 className="text-2xl font-semibold uppercase text-[#111111]">
					{title}
				</h1>
				{description && (
					<p className="mt-1 text-sm text-muted-foreground max-w-55 sm:max-w-none">
						{description}
					</p>
				)}
			</div>
			{actions && (
				<div className="flex flex-wrap items-center flex-auto gap-3 md:flex-none">
					{actions}
				</div>
			)}
		</div>
	)
}
