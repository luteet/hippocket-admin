import { useNavigate } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ReferenceForm } from './ReferenceForm'
import { REFERENCE_CONFIG, type ReferenceKind } from './useReferenceListPage'

export function ReferenceCreatePage({ kind }: { kind: ReferenceKind }) {
	const navigate = useNavigate()
	const config = REFERENCE_CONFIG[kind]

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title={`New ${config.singular.toLowerCase()}`}
					actions={
						<Button
							variant="outline"
							onClick={() => navigate(`/${kind}`)}
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
					<Reveal index={1}>
						<ReferenceForm
							kind={kind}
							onSuccess={(item) =>
								navigate(`/${kind}/${item.id}`)
							}
							onCancel={() => navigate(`/${kind}`)}
						/>
					</Reveal>
				</CardContent>
			</Card>
		</div>
	)
}
