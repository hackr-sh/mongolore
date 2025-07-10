import type { ClassValue } from 'clsx'
import { useEffect, useId, useState } from 'react'

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
  error,
  value,
  placeholderAsLabel,
  containerClassName,
  ...props
}: {
  label?: string
  placeholder: string
  type: string
  prefix?: string
  suffix?: string
  className?: ClassValue
  error?: string
  placeholderAsLabel?: boolean
  containerClassName?: ClassValue
} & React.ComponentProps<typeof Input>) {
  const id = useId()
  const [canShowError, setCanShowError] = useState(false)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (value) {
      setCanShowError(true)
    }
  }, [value])

  return (
    <div className={cn('*:not-first:mt-2 relative', containerClassName)}>
      {label && (
        <Label
          className={cn(
            placeholderAsLabel &&
              'absolute top-4 left-3 transition-all duration-200 text-sm text-muted-foreground/70',
            placeholderAsLabel &&
              (focused || value) &&
              'top-0 left-1 bg-background px-2 text-xs text-muted-foreground'
          )}
          htmlFor={id}
        >
          {label}
        </Label>
      )}
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
            error && canShowError && 'border-destructive',
            placeholderAsLabel &&
              'placeholder:transition-all placeholder:duration-200 placeholder:delay-75 placeholder:opacity-0',
            placeholderAsLabel &&
              focused &&
              'placeholder:left-3 placeholder:opacity-100',
            className
          )}
          placeholder={placeholder}
          type={type}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {suffix ? (
          <span className="border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-e-md border px-3 text-sm">
            {suffix}
          </span>
        ) : null}
      </div>
      {error && canShowError && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
