import type { ClassValue } from 'clsx'
import { useId } from 'react'

import { Input } from 'renderer/components/ui/input'
import { Label } from 'renderer/components/ui/label'
import { cn } from 'renderer/lib/utils'

export default function ComplexInput({
  label,
  placeholder,
  type,
  prefix,
  suffix,
  className,
  ...props
}: {
  label?: string
  placeholder: string
  type: string
  prefix?: string
  suffix?: string
  className?: ClassValue
} & React.ComponentProps<typeof Input>) {
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex rounded-md shadow-xs">
        {prefix ? (
          <span className="border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-s-md border px-3 text-sm">
            {prefix}
          </span>
        ) : null}
        <Input
          id={id}
          className={cn(
            'shadow-none',
            prefix && 'rounded-s-none -ms-px',
            suffix && 'rounded-e-none -me-px',
            className
          )}
          placeholder={placeholder}
          type={type}
          {...props}
        />
        {suffix ? (
          <span className="border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-e-md border px-3 text-sm">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  )
}
