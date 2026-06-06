import { useNavigate } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PartnerForm } from './PartnerForm'

export function PartnerCreatePage() {
	const navigate = useNavigate()

	return (
		<div>
			<Reveal index={0}>
				<PageHeader
					title="New partner"
					actions={
						<Button
							variant="outline"
							onClick={() => navigate('/partners')}
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
						<PartnerForm
							onSuccess={(p) => navigate(`/partners/${p.id}`)}
							onCancel={() => navigate('/partners')}
						/>
					</Reveal>
				</CardContent>
			</Card>
		</div>
	)
}
