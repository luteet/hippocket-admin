import { useNavigate, useParams } from 'react-router'

import { FormPage } from '@/components/form/FormPage'
import { useContact } from './hooks'
import { ContactForm } from './ContactForm'

export function ContactEditPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data: contact, isLoading } = useContact(id)

	return (
		<FormPage
			title="Edit contact"
			onBack={() => navigate(`/contacts/${id}`)}
			isLoading={isLoading}
			ready={Boolean(contact)}
		>
			<ContactForm
				contact={contact}
				onSuccess={(c) => navigate(`/contacts/${c.id}`)}
				onCancel={() => navigate(`/contacts/${id}`)}
			/>
		</FormPage>
	)
}
