import { useNavigate, useParams } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCatalogItem } from './hooks'
import { ReferenceForm } from './ReferenceForm'
import { REFERENCE_CONFIG, type ReferenceKind } from './useReferenceListPage'

export function ReferenceEditPage({ kind }: { kind: ReferenceKind }) {
	const { id } = useParams()
	const navigate = useNavigate()
	const config = REFERENCE_CONFIG[kind]
	const { data: item, isLoading } = useCatalogItem(
		config.queryKey,
		config.endpoint,
		id,
	)

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title={`Edit ${config.singular.toLowerCase()}`}
					actions={
						<Button
							variant="outline"
							onClick={() => navigate(`/${kind}/${id}`)}
							aria-label="Back"
						>
							<Icon name="arrow-left" />
							<span className="sm:inline hidden">Back</span>
						</Button>
					}
				/>
			</Reveal>
			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					{isLoading ? (
						<div className="space-y-3">
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-2/3" />
						</div>
					) : !item ? (
						<p className="text-muted-foreground">
							{config.singular} not found
						</p>
					) : (
						<Reveal index={1}>
							<ReferenceForm
								kind={kind}
								item={item}
								onSuccess={(saved) =>
									navigate(`/${kind}/${saved.id}`)
								}
								onCancel={() => navigate(`/${kind}/${id}`)}
							/>
						</Reveal>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
