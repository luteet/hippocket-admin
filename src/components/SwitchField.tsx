import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function SwitchField({
	id,
	label,
	checked,
	onCheckedChange,
}: {
	id: string
	label: string
	checked: boolean
	onCheckedChange: (checked: boolean) => void
}) {
	return (
		<Label
			htmlFor={id}
			className="flex cursor-pointer items-center justify-between rounded-md border border-border p-4 text-sm"
		>
			{label}
			<Switch
				id={id}
				checked={checked}
				onCheckedChange={onCheckedChange}
			/>
		</Label>
	)
}
