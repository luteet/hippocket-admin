import {
	forwardRef,
	type ComponentPropsWithoutRef,
	type ComponentRef,
} from 'react'
import * as CheckboxPrimitives from '@radix-ui/react-checkbox'

import { Icon } from '@/components/Icon'
import { cn } from '@/lib/utils'

const Checkbox = forwardRef<
	ComponentRef<typeof CheckboxPrimitives.Root>,
	ComponentPropsWithoutRef<typeof CheckboxPrimitives.Root>
>(({ className, checked, ...props }, ref) => (
	<CheckboxPrimitives.Root
		ref={ref}
		checked={checked}
		className={cn('checkbox', className)}
		{...props}
	>
		<CheckboxPrimitives.Indicator className="checkbox-indicator">
			{checked === 'indeterminate' ? (
				<span className="checkbox-dash" />
			) : (
				<Icon name="check" />
			)}
		</CheckboxPrimitives.Indicator>
	</CheckboxPrimitives.Root>
))
Checkbox.displayName = CheckboxPrimitives.Root.displayName

export { Checkbox }
