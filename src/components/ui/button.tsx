// Adapted from shadcn/ui's MIT-licensed Radix Button pattern. See public/THIRD_PARTY_NOTICES.txt.
import type { ComponentProps } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
const variants=cva('button', {variants:{variant:{default:'button-primary',outline:'button-outline',light:'button-light'},size:{default:'',small:'button-small'}},defaultVariants:{variant:'default',size:'default'}});
export function Button({asChild=false,variant,size,className,...props}:ComponentProps<'button'>&VariantProps<typeof variants>&{asChild?:boolean}) {
 const Comp=asChild?Slot:'button'; return <Comp className={cn(variants({variant,size}),className)} {...props}/>;
}
