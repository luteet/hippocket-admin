import { Badge } from '@/components/ui/badge'
import { DetailGrid } from '@/components/DetailList'
import { DetailPage } from '@/components/detail/DetailPage'
import { DetailBody } from '@/components/detail/DetailBody'
import { MediaThumbnail } from '@/components/media/MediaThumbnail'
import { TimeAgo } from '@/components/TimeAgo'
import { useGroupDetailPage } from './useGroupDetailPage'
import { ColorRow } from './components/ColorRow'

export function GroupDetailPage() {
	const {
		group,
		isLoading,
		tab,
		setTab,
		isDeleting,
		handleDelete,
		goBack,
		goToEdit,
		openAgent,
	} = useGroupDetailPage()

	return (
		<DetailPage
			title="Group"
			onBack={goBack}
			ready={Boolean(group)}
			isLoading={isLoading}
			onEdit={goToEdit}
			onDelete={handleDelete}
			deleteTitle="Delete group?"
			deleteDescription={`Group "${group?.name ?? ''}" will be soft-deleted — marked as deleted and hidden, but kept in the database and restorable later.`}
			isDeleting={isDeleting}
			activeTab={tab}
			onTabChange={(key) => setTab(key as typeof tab)}
			tabs={[
				{
					key: 'general',
					label: 'General',
					content: group ? (
						<DetailBody
							heading={{
								title: group.name,
								subtitle: group.slug,
								avatar: (
									<MediaThumbnail
										url={group.logo_url}
										shape="square"
										placeholderIcon="image"
										fit="contain"
									/>
								),
								badge: group.is_deleted ? (
									<Badge variant="destructive">Deleted</Badge>
								) : (
									<Badge variant="success">Active</Badge>
								),
							}}
							fields={[
								{ label: 'Name', value: group.name },
								{ label: 'Slug', value: group.slug },
								{
									label: 'Title logo',
									value: group.title_logo,
								},
								{
									label: 'Logo',
									render: (
										<MediaThumbnail
											url={group.logo_url}
											shape="square"
											placeholderIcon="image"
											fit="contain"
										/>
									),
								},
								{
									label: 'People',
									value: group.count_people,
								},
								{
									label: 'Closed referrals',
									value: group.count_close_refferals,
								},
								{
									label: 'Admins',
									render: group.admin_ids.length ? (
										<div className="flex flex-col gap-1">
											{group.admin_ids.map(
												(adminId, index) => (
													<button
														key={adminId}
														type="button"
														onClick={() =>
															openAgent(adminId)
														}
														className="text-left link"
													>
														Admin #{index + 1}
													</button>
												),
											)}
										</div>
									) : (
										<span className="text-muted-foreground">
											—
										</span>
									),
								},
								{
									label: 'Deleted',
									bool: group.is_deleted,
								},
								{
									label: 'Deleted at',
									render: (
										<TimeAgo value={group.deleted_at} />
									),
								},
							]}
						/>
					) : null,
				},
				{
					key: 'theme',
					label: 'Theme',
					content: group ? (
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
							<ColorRow label="Text" value={group.color_text} />
						</DetailGrid>
					) : null,
				},
			]}
		/>
	)
}
