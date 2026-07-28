import { DetailPage } from '@/components/detail/DetailPage'
import { DetailPageProvider } from '@/components/detail/DetailPageContext'
import { useStatusDetailPage } from './useStatusDetailPage'

export function StatusDetailPage() {
	const { status, ...detailCtx } = useStatusDetailPage()

	return (
		<DetailPageProvider value={detailCtx}>
			<DetailPage
				title="Status"
				deleteTitle="Delete status?"
				deleteDescription={`Status "${status?.name ?? ''}" will be permanently deleted.`}
				notFound={<p className="text-muted-foreground">Status not found</p>}
				heading={
					status
						? { title: status.name, subtitle: status.label }
						: undefined
				}
				fields={
					status
						? [
								{ label: 'Name', value: status.name },
								{ label: 'Label', value: status.label },
								{ label: 'Priority', value: status.priority },
							]
						: undefined
				}
			/>
		</DetailPageProvider>
	)
}
