import type { ClassValue } from 'clsx'
import { useId } from 'react'

import { Label } from 'renderer/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'renderer/components/ui/select'
import { cn } from 'renderer/lib/utils'

export default function ComplexSelect({
  label,
  placeholder,
  options,
  triggerClassName,
  ...props
}: {
  label?: string
  placeholder: string
  options: { label: string; value: string }[]
  triggerClassName?: ClassValue
} & React.ComponentProps<typeof Select>) {
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Select {...props}>
        <SelectTrigger id={id} className={cn(triggerClassName)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
