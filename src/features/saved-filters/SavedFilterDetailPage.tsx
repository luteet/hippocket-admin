import { Link } from 'react-router'

import { DetailPage } from '@/components/detail/DetailPage'
import { DetailPageProvider } from '@/components/detail/DetailPageContext'
import { TimeAgo } from '@/components/TimeAgo'
import { useSavedFilterDetailPage } from './useSavedFilterDetailPage'
import { formatDateTime, savedFilterTitle } from './format'

export function SavedFilterDetailPage() {
	const { filter, ...detailCtx } = useSavedFilterDetailPage()

	return (
		<DetailPageProvider value={detailCtx}>
			<DetailPage
				title="Saved Filter"
				deleteTitle="Delete saved filter?"
				deleteDescription="This saved filter will be permanently deleted."
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
									fullWidth: true,
									render: (
										<span className="font-mono text-xs break-all">
											{filter.value}
										</span>
									),
								},
								{
									label: 'Created',
									render: <TimeAgo value={filter.created_at} />,
								},
							]
						: undefined
				}
			/>
		</DetailPageProvider>
	)
}
