import { Link } from 'react-router'

import { DetailPage } from '@/components/detail/DetailPage'
import { useSavedFilterDetailPage } from './useSavedFilterDetailPage'
import { formatDateTime, savedFilterTitle } from './format'

export function SavedFilterDetailPage() {
	const { filter, isLoading, isDeleting, handleDelete, goBack, goToEdit } =
		useSavedFilterDetailPage()

	return (
		<DetailPage
			title="Saved Filter"
			onBack={goBack}
			ready={Boolean(filter)}
			isLoading={isLoading}
			onEdit={goToEdit}
			onDelete={handleDelete}
			deleteTitle="Delete saved filter?"
			deleteDescription="This saved filter will be permanently deleted."
			isDeleting={isDeleting}
			heading={
				filter
					? {
							title: savedFilterTitle(filter.title),
							subtitle: formatDateTime(filter.created_at),
						}
					: undefined
			}
			fields={
				filter
					? [
							{
								label: 'Agent',
								render: (
									<Link
										to={`/agents/${filter.user_id}`}
										className="link"
									>
										{filter.user_email}
									</Link>
								),
							},
							{ label: 'Email', value: filter.user_email },
							{
								label: 'Value',
								render: (
									<span className="font-mono text-xs break-all">
										{filter.value}
									</span>
								),
							},
							{
								label: 'Created',
								value: formatDateTime(filter.created_at),
							},
						]
					: undefined
			}
		/>
	)
}
