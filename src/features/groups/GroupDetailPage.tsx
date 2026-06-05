import { type ReactNode } from 'react'
import { AnimatePresence } from 'motion/react'

import { Icon } from '@/components/Icon'
import { PageTransition } from '@/components/PageTransition'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { DetailGrid, DetailRow } from '@/components/DetailList'
import { formatDateTime } from '@/lib/format'
import { useGroupDetailPage } from './useGroupDetailPage'

export function GroupDetailPage() {
	const { group, isLoading, tab, setTab, goBack, openAgent } =
		useGroupDetailPage()

	return (
		<div>
			<PageHeader
				title="Group"
				actions={
					<Button
						variant="outline"
						onClick={goBack}
						aria-label="Back"
					>
						<Icon name="arrow-left" />
						<span className="sm:inline hidden">Back</span>
					</Button>
				}
			/>

			<div className="mb-6 flex gap-1 border-b border-border">
				<TabButton
					active={tab === 'general'}
					onClick={() => setTab('general')}
				>
					General
				</TabButton>
				<TabButton
					active={tab === 'theme'}
					onClick={() => setTab('theme')}
				>
					Theme
				</TabButton>
			</div>

			<AnimatePresence mode="wait" initial={false}>
				<PageTransition key={tab}>
					<Card className="max-w-2xl">
						<CardContent className="pt-6">
							{isLoading || !group ? (
								<div className="space-y-3">
									<Skeleton className="h-6 w-1/2" />
									<Skeleton className="h-5 w-2/3" />
									<Skeleton className="h-5 w-1/3" />
								</div>
							) : tab === 'theme' ? (
								<DetailGrid>
									<ColorRow
										label="Accent"
										value={group.color_accent}
									/>
									<ColorRow
										label="Primary"
										value={group.color_primary}
									/>
									<ColorRow
										label="Secondary"
										value={group.color_secondary}
									/>
									<ColorRow
										label="Secondary (light)"
										value={group.color_secondary_light}
									/>
									<ColorRow
										label="Text"
										value={group.color_text}
									/>
								</DetailGrid>
							) : (
								<div className="space-y-4">
									<div className="flex items-center justify-between gap-4">
										<div>
											<p className="text-xl font-semibold">
												{group.name}
											</p>
											<p className="pt-2 text-sm font-medium text-muted-foreground">
												{group.slug}
											</p>
										</div>
										{group.is_deleted ? (
											<Badge variant="destructive">
												Deleted
											</Badge>
										) : (
											<Badge variant="success">
												Active
											</Badge>
										)}
									</div>

									<Separator className="mt-8" />

									<DetailGrid className="mt-8">
										<DetailRow
											label="Name"
											value={group.name}
										/>
										<DetailRow
											label="Slug"
											value={group.slug}
										/>
										<DetailRow
											label="Title logo"
											value={group.title_logo}
										/>
										<DetailRow label="Logo">
											{group.logo_url ? (
												<a
													href={group.logo_url}
													target="_blank"
													rel="noreferrer"
													className="text-primary hover:underline"
												>
													{group.logo_url}
												</a>
											) : (
												<span className="text-muted-foreground">
													—
												</span>
											)}
										</DetailRow>
										<DetailRow
											label="People"
											value={String(group.count_people)}
										/>
										<DetailRow
											label="Closed referrals"
											value={String(
												group.count_close_refferals,
											)}
										/>
										<DetailRow label="Admins">
											{group.admin_ids.length ? (
												<div className="flex flex-col gap-1">
													{group.admin_ids.map(
														(adminId) => (
															<button
																key={adminId}
																type="button"
																onClick={() =>
																	openAgent(
																		adminId,
																	)
																}
																className="text-left text-primary hover:underline"
															>
																{adminId}
															</button>
														),
													)}
												</div>
											) : (
												<span className="text-muted-foreground">
													—
												</span>
											)}
										</DetailRow>
										<DetailRow
											label="Deleted"
											bool={group.is_deleted}
										/>
										<DetailRow
											label="Deleted at"
											value={formatDateTime(
												group.deleted_at,
											)}
										/>
									</DetailGrid>
								</div>
							)}
						</CardContent>
					</Card>
				</PageTransition>
			</AnimatePresence>
		</div>
	)
}

function ColorRow({ label, value }: { label: string; value: string }) {
	return (
		<DetailRow label={label}>
			<div className="flex items-center gap-2">
				<span
					className="size-5 rounded-full border"
					style={{ backgroundColor: value }}
				/>
				<span className="tabular-nums">{value || '—'}</span>
			</div>
		</DetailRow>
	)
}

function TabButton({
	active,
	onClick,
	children,
}: {
	active: boolean
	onClick: () => void
	children: ReactNode
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			data-active={active}
			className="-mb-px border-b-2 border-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[active=true]:border-primary data-[active=true]:text-foreground"
		>
			{children}
		</button>
	)
}
