import { DetailRow } from '@/components/DetailList'

export function ColorRow({ label, value }: { label: string; value: string }) {
	return (
		<DetailRow label={label}>
			<div className="flex items-center gap-2">
				<span
					className="size-5 rounded-full border"
					style={{ backgroundColor: value }}
				/>
				<span className="tabular-nums">{value || '—'}</span>
			</div>
		</DetailRow>
	)
}
