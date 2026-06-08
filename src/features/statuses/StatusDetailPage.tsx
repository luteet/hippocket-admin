import { DetailPage } from '@/components/detail/DetailPage'
import { useStatusDetailPage } from './useStatusDetailPage'

export function StatusDetailPage() {
	const { status, isLoading, isDeleting, handleDelete, goBack, goToEdit } =
		useStatusDetailPage()

	return (
		<DetailPage
			title="Status"
			onBack={goBack}
			ready={Boolean(status)}
			isLoading={isLoading}
			onEdit={goToEdit}
			onDelete={handleDelete}
			deleteTitle="Delete status?"
			deleteDescription={`Status "${status?.name ?? ''}" will be permanently deleted.`}
			isDeleting={isDeleting}
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
	)
}
