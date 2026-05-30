import { useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PartnerForm } from './PartnerForm'

export function PartnerCreatePage() {
	const navigate = useNavigate()

	return (
		<div>
			<PageHeader
				title="New partner"
				actions={
					<Button
						variant="outline"
						onClick={() => navigate('/partners')}
					>
						<ArrowLeft />
						Back
					</Button>
				}
			/>
			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					<PartnerForm
						onSuccess={(p) => navigate(`/partners/${p.id}`)}
						onCancel={() => navigate('/partners')}
					/>
				</CardContent>
			</Card>
		</div>
	)
}
