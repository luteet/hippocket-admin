import { Link } from 'react-router'

import { DetailPage } from '@/components/detail/DetailPage'
import { DetailPageProvider } from '@/components/detail/DetailPageContext'
import { TimeAgo } from '@/components/TimeAgo'
import { useTeamLeaderDetailPage } from './useTeamLeaderDetailPage'
import { formatDateTime } from './format'

export function TeamLeaderDetailPage() {
	const { leader, ...detailCtx } = useTeamLeaderDetailPage()

	return (
		<DetailPageProvider value={detailCtx}>
			<DetailPage
				title="Team Leader"
				deleteTitle="Delete team leader?"
				deleteDescription="This team leader will be permanently deleted."
				heading={
					leader
						? {
								title: leader.tl_name,
								subtitle: formatDateTime(leader.created_at),
							}
						: undefined
				}
				fields={
					leader
						? [
								{
									label: 'Group',
									render: (
										<Link
											to={`/groups/${leader.group_id}`}
											className="link"
										>
											{leader.group_name}
										</Link>
									),
								},
								{ label: 'Email', value: leader.tl_email },
								{ label: 'Phone', value: leader.tl_phone },
								{
									label: 'Office location',
									value: leader.office_location,
								},
								{
									label: 'Created',
									render: <TimeAgo value={leader.created_at} />,
								},
							]
						: undefined
				}
			/>
		</DetailPageProvider>
	)
}
