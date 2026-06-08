import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { FormLayout } from '@/components/form/FormLayout'
import type { FormFieldEntry } from '@/components/form/types'
import type { TeamLeader } from '@/types/api'
import { useTeamLeaderForm } from './useTeamLeaderForm'

interface Props {
	leader?: TeamLeader | null
	onSuccess: (leader: TeamLeader) => void
	onCancel: () => void
}

export function TeamLeaderForm({ leader, onSuccess, onCancel }: Props) {
	const { form, isPending, onSubmit, groupOptions } = useTeamLeaderForm({
		leader,
		onSuccess,
	})

	const groupId = form.watch('group_id')

	const fields: FormFieldEntry[] = [
		{
			// group_id is numeric — the shadcn Select works with strings, so it
			// can't go through the declarative `select` (which keeps strings).
			type: 'custom',
			label: 'Group',
			name: 'group_id',
			render: (
				<Select
					value={groupId ? String(groupId) : undefined}
					onValueChange={(v) =>
						form.setValue('group_id', Number(v), {
							shouldValidate: true,
						})
					}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select a group" />
					</SelectTrigger>
					<SelectContent>
						{groupOptions.map((o) => (
							<SelectItem key={o.id} value={String(o.id)}>
								{o.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			),
		},
		{
			type: 'text',
			name: 'tl_name',
			label: 'Name',
			placeholder: 'Jane Smith',
		},
		{
			type: 'email',
			name: 'tl_email',
			label: 'Email',
			placeholder: 'jane@example.com',
		},
		{
			type: 'text',
			name: 'tl_phone',
			label: 'Phone',
			placeholder: '+12125551234',
		},
		{
			type: 'text',
			name: 'office_location',
			label: 'Office location',
			placeholder: 'Austin',
		},
	]

	return (
		<FormLayout
			form={form}
			fields={fields}
			onSubmit={onSubmit}
			onCancel={onCancel}
			isPending={isPending}
		/>
	)
}
