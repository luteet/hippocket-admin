import { useNavigate } from 'react-router'

import { Icon } from '@/components/Icon'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LinkNameForm } from './LinkNameForm'

export function LinkNameCreatePage() {
	const navigate = useNavigate()
	const back = () => navigate('/link-names')

	return (
		<div>
			<PageHeader
				title="New link"
				actions={
					<Button variant="outline" onClick={back} aria-label="Back">
						<Icon name="arrow-left" />
						<span className="sm:inline hidden">Back</span>
					</Button>
				}
			/>
			<Card className="max-w-2xl">
				<CardContent className="pt-6">
					<LinkNameForm
						onSuccess={back}
						onCancel={back}
						onDeleted={back}
					/>
				</CardContent>
			</Card>
		</div>
	)
}
