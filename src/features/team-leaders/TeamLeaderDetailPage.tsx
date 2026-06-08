import { Link } from 'react-router'

import { DetailPage } from '@/components/detail/DetailPage'
import { useTeamLeaderDetailPage } from './useTeamLeaderDetailPage'
import { formatDateTime } from './format'

export function TeamLeaderDetailPage() {
	const { leader, isLoading, isDeleting, handleDelete, goBack, goToEdit } =
		useTeamLeaderDetailPage()

	return (
		<DetailPage
			title="Team Leader"
			onBack={goBack}
			ready={Boolean(leader)}
			isLoading={isLoading}
			onEdit={goToEdit}
			onDelete={handleDelete}
			deleteTitle="Delete team leader?"
			deleteDescription="This team leader will be permanently deleted."
			isDeleting={isDeleting}
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
							value: formatDateTime(leader.created_at),
						},
					]
					: undefined
			}
		/>
	)
}
