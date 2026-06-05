import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ColorField({
	label,
	value,
	onChange,
	error,
}: {
	label: string
	value: string
	onChange: (value: string) => void
	error?: string
}) {
	// A native color picker only accepts 6-digit hex; fall back to black for the
	// swatch when the text value isn't yet a valid 6-digit color.
	const swatch = /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#000000'
	return (
		<div className="space-y-3">
			<Label>{label}</Label>
			<div className="flex items-center gap-3">
				<input
					type="color"
					aria-label={`${label} color picker`}
					value={swatch}
					onChange={(e) => onChange(e.target.value)}
					className="size-9 shrink-0 cursor-pointer rounded-md border border-border bg-transparent"
				/>
				<Input
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="font-mono"
				/>
			</div>
			{error && <p className="text-xs text-destructive">{error}</p>}
		</div>
	)
}
