import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'
import Image from 'next/image'

interface AvatarProps {
  src?: string | null
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-xl',
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const initials = getInitials(name)

  return (
    <div
      className={cn(
        'relative shrink-0 rounded-full bg-cc-accent-subtle border border-blue-100 overflow-hidden flex items-center justify-center',
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover"
          sizes="80px"
          onError={(e) => {
            // Hide broken image, show initials fallback
            ;(e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      ) : (
        <span className="font-semibold text-cc-accent select-none">{initials}</span>
      )}
    </div>
  )
}

/** Avatar with name + subtitle stacked beside it */
interface AvatarWithTextProps extends AvatarProps {
  subtitle?: string
  subtitleClassName?: string
}

export function AvatarWithText({
  src,
  name,
  size = 'md',
  subtitle,
  className,
  subtitleClassName,
}: AvatarWithTextProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Avatar src={src} name={name} size={size} />
      <div className="flex flex-col min-w-0">
        <span className="font-medium text-cc-text text-sm truncate">{name}</span>
        {subtitle && (
          <span className={cn('text-xs text-cc-text-muted truncate', subtitleClassName)}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}
