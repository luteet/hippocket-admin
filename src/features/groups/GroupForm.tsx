import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/Field'
import { TabButton } from '@/components/TabButton'
import type { Group } from '@/types/api'
import { useGroupForm } from './useGroupForm'
import { ColorField } from './components/ColorField'
import { AdminMultiSelect } from './components/AdminMultiSelect'

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
		register,
		errors,
		adminIds,
		colors,
		toggleAdmin,
		setColor,
		agentOptions,
		isPending,
		onSubmit,
	} = useGroupForm({ group, onSuccess })

	return (
		<form onSubmit={onSubmit} className="space-y-6">
			<div className="flex gap-1 border-b border-border">
				<TabButton
					active={tab === 'general'}
					onClick={() => setTab('general')}
				>
					General
				</TabButton>
				<TabButton
					active={tab === 'theme'}
					onClick={() => setTab('theme')}
				>
					Theme
				</TabButton>
			</div>

			{/* Both panels stay mounted (toggled with `hidden`) so field values and
			    focus survive tab switches and cross-tab validation works. */}
			<div className={tab === 'general' ? 'space-y-6' : 'hidden'}>
				<Field label="Name" error={errors.name?.message}>
					<Input {...register('name')} />
				</Field>
				<Field label="Slug" error={errors.slug?.message}>
					<Input
						disabled={isEdit}
						placeholder={isEdit ? undefined : 'austin-team'}
						{...register('slug')}
					/>
				</Field>
				<Field label="Title logo" error={errors.title_logo?.message}>
					<Input {...register('title_logo')} />
				</Field>
				<Field label="Admins">
					<AdminMultiSelect
						options={agentOptions}
						selected={adminIds}
						onToggle={toggleAdmin}
					/>
				</Field>
			</div>

			<div className={tab === 'theme' ? 'space-y-6' : 'hidden'}>
				<ColorField
					label="Accent"
					value={colors.color_accent}
					onChange={(v) => setColor('color_accent', v)}
					error={errors.color_accent?.message}
				/>
				<ColorField
					label="Primary"
					value={colors.color_primary}
					onChange={(v) => setColor('color_primary', v)}
					error={errors.color_primary?.message}
				/>
				<ColorField
					label="Secondary"
					value={colors.color_secondary}
					onChange={(v) => setColor('color_secondary', v)}
					error={errors.color_secondary?.message}
				/>
				<ColorField
					label="Secondary (light)"
					value={colors.color_secondary_light}
					onChange={(v) => setColor('color_secondary_light', v)}
					error={errors.color_secondary_light?.message}
				/>
				<ColorField
					label="Text"
					value={colors.color_text}
					onChange={(v) => setColor('color_text', v)}
					error={errors.color_text?.message}
				/>
			</div>

			<div className="flex justify-end gap-2 pt-4">
				<Button
					type="button"
					variant="outline"
					className="flex-auto xs:min-w-32 xs:flex-none"
					onClick={onCancel}
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={isPending}
					className="flex-auto xs:min-w-32 xs:flex-none"
				>
					{isPending && (
						<Icon name="loader" className="animate-spin" />
					)}
					Save
				</Button>
			</div>
		</form>
	)
}
