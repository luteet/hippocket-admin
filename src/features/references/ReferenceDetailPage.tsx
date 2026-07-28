import { DetailPage } from '@/components/detail/DetailPage'
import { DetailPageProvider } from '@/components/detail/DetailPageContext'
import { SectionTitle } from '@/components/SectionTitle'
import { CategoryIconUpload } from './components/CategoryIconUpload'
import { useReferenceDetailPage } from './useReferenceDetailPage'
import type { ReferenceKind } from './useReferenceListPage'

export function ReferenceDetailPage({ kind }: { kind: ReferenceKind }) {
	const { config, item, ...detailCtx } = useReferenceDetailPage(kind)

	return (
		<DetailPageProvider value={detailCtx}>
			<DetailPage
				title={config.singular}
				deleteTitle={`Delete ${config.singular.toLowerCase()}?`}
				deleteDescription={`${config.singular} "${item?.name ?? ''}" will be permanently deleted.`}
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
									fullWidth: true,
								},
								{
									label: 'Keywords',
									value: item.keywords,
									hidden: !config.hasContent,
									fullWidth: true,
								},
							]
						: undefined
				}
			>
				{item && config.hasIcon && (
					<>
						<SectionTitle>Icon</SectionTitle>
						<CategoryIconUpload
							categoryId={item.id}
							iconUrl={item.icon ?? null}
							queryKey={config.queryKey}
						/>
					</>
				)}
			</DetailPage>
		</DetailPageProvider>
	)
}
