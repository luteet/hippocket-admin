import { useNavigate } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { ContactForm } from './ContactForm'

export function ContactCreatePage() {
	const navigate = useNavigate()

	return (
		<FormPage title="New contact" onBack={() => navigate('/contacts')}>
			<ContactForm
				onSuccess={(c) => navigate(`/contacts/${c.id}`)}
				onCancel={() => navigate('/contacts')}
			/>
		</FormPage>
	)
}
