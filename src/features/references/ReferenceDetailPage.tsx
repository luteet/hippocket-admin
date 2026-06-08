import { DetailPage } from '@/components/detail/DetailPage'
import { useReferenceDetailPage } from './useReferenceDetailPage'
import type { ReferenceKind } from './useReferenceListPage'

export function ReferenceDetailPage({ kind }: { kind: ReferenceKind }) {
	const {
		config,
		item,
		isLoading,
		isDeleting,
		handleDelete,
		goBack,
		goToEdit,
	} = useReferenceDetailPage(kind)

	return (
		<DetailPage
			title={config.singular}
			onBack={goBack}
			ready={Boolean(item)}
			isLoading={isLoading}
			onEdit={goToEdit}
			onDelete={handleDelete}
			deleteTitle={`Delete ${config.singular.toLowerCase()}?`}
			deleteDescription={`${config.singular} "${item?.name ?? ''}" will be permanently deleted.`}
			isDeleting={isDeleting}
			notFound={
				<p className="text-muted-foreground">
					{config.singular} not found
				</p>
			}
			heading={item ? { title: item.name } : undefined}
			fields={
				item
					? [
							{ label: 'Name', value: item.name },
							{ label: 'Sort', value: item.sort },
							{
								label: 'Description',
								value: item.description,
								hidden: !config.hasContent,
							},
							{
								label: 'Keywords',
								value: item.keywords,
								hidden: !config.hasContent,
							},
						]
					: undefined
			}
		/>
	)
}
