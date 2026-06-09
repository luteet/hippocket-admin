import { Controller, type Control } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import type { PropertyFormValues } from '../usePropertyForm'

// Strips everything but digits and renders as `$350,000`; empty stays empty.
function formatPrice(raw: string): string {
	const digits = raw.replace(/\D/g, '')
	if (!digits) return ''
	return `$${Number(digits).toLocaleString('en-US')}`
}

interface Props {
	control: Control<PropertyFormValues>
	name: 'asking_price'
	placeholder?: string
}

/**
 * A money input that lets the user type freely, then normalizes the value to a
 * `$350,000`-style string on blur. The stored value is that formatted string.
 */
export function PriceInput({ control, name, placeholder }: Props) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field }) => (
				<Input
					inputMode="numeric"
					placeholder={placeholder}
					value={field.value ?? ''}
					onChange={(e) => field.onChange(e.target.value)}
					onBlur={() => {
						field.onChange(formatPrice(field.value ?? ''))
						field.onBlur()
					}}
				/>
			)}
		/>
	)
}
