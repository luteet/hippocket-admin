import { useNavigate } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FormConfigForm } from './FormConfigForm'

export function FormConfigCreatePage() {
	const navigate = useNavigate()
	const back = () => navigate('/form-configs')

	return (
		<div>
			<PageHeader
				title="New form"
				actions={
					<Button variant="outline" onClick={back} aria-label="Back">
						<Icon name="arrow-left" />
						<span className="sm:inline hidden">Back</span>
					</Button>
				}
			/>
			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					<FormConfigForm
						onSuccess={back}
						onCancel={back}
						onDeleted={back}
					/>
				</CardContent>
			</Card>
		</div>
	)
}
