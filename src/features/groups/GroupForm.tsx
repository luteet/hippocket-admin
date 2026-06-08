import { FormLayout } from '@/components/form/FormLayout'
import type { FormFieldEntry } from '@/components/form/types'
import type { Group } from '@/types/api'
import { useGroupForm } from './useGroupForm'
import { ColorField } from './components/ColorField'
import { AdminMultiSelect } from './components/AdminMultiSelect'
import { LogoUpload } from './components/LogoUpload'

interface Props {
	group?: Group | null
	onSuccess: (group: Group) => void
	onCancel: () => void
}

export function GroupForm({ group, onSuccess, onCancel }: Props) {
	const {
		isEdit,
		tab,
		setTab,
		form,
		adminIds,
		colors,
		toggleAdmin,
		setColor,
		agentOptions,
		isPending,
		onSubmit,
	} = useGroupForm({ group, onSuccess })

	const errors = form.formState.errors

	const general: FormFieldEntry[] = [
		{ type: 'text', name: 'name', label: 'Name' },
		{
			type: 'text',
			name: 'slug',
			label: 'Slug',
			disabled: isEdit,
			placeholder: isEdit ? undefined : 'austin-team',
		},
		{ type: 'text', name: 'title_logo', label: 'Title logo' },
		// Logo upload is a standalone action that needs an existing group, so it
		// only appears on edit.
		isEdit &&
			group && {
				type: 'custom',
				label: 'Logo',
				render: (
					<LogoUpload groupId={group.id} logoUrl={group.logo_url} />
				),
			},
		{
			type: 'custom',
			label: 'Admins',
			render: (
				<AdminMultiSelect
					options={agentOptions}
					selected={adminIds}
					onToggle={toggleAdmin}
				/>
			),
		},
	]

	const theme: FormFieldEntry[] = [
		{
			type: 'custom',
			render: (
				<ColorField
					label="Accent"
					value={colors.color_accent}
					onChange={(v) => setColor('color_accent', v)}
					error={errors.color_accent?.message}
				/>
			),
		},
		{
			type: 'custom',
			render: (
				<ColorField
					label="Primary"
					value={colors.color_primary}
					onChange={(v) => setColor('color_primary', v)}
					error={errors.color_primary?.message}
				/>
			),
		},
		{
			type: 'custom',
			render: (
				<ColorField
					label="Secondary"
					value={colors.color_secondary}
					onChange={(v) => setColor('color_secondary', v)}
					error={errors.color_secondary?.message}
				/>
			),
		},
		{
			type: 'custom',
			render: (
				<ColorField
					label="Secondary (light)"
					value={colors.color_secondary_light}
					onChange={(v) => setColor('color_secondary_light', v)}
					error={errors.color_secondary_light?.message}
				/>
			),
		},
		{
			type: 'custom',
			render: (
				<ColorField
					label="Text"
					value={colors.color_text}
					onChange={(v) => setColor('color_text', v)}
					error={errors.color_text?.message}
				/>
			),
		},
	]

	return (
		<FormLayout
			form={form}
			onSubmit={onSubmit}
			onCancel={onCancel}
			isPending={isPending}
			activeTab={tab}
			onTabChange={(key) => setTab(key as typeof tab)}
			tabs={[
				{ key: 'general', label: 'General', fields: general },
				{ key: 'theme', label: 'Theme', fields: theme },
			]}
		/>
	)
}
