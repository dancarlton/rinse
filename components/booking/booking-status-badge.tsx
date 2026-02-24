import { Badge } from '@/components/ui/badge'
import { BookingStatus } from '@/types/database'
import { cn } from '@/lib/utils'

interface BookingStatusBadgeProps {
  status: BookingStatus
  className?: string
}

const statusConfig: Record<BookingStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
  pending: {
    label: 'Pending',
    variant: 'outline',
    className: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-500',
  },
  confirmed: {
    label: 'Confirmed',
    variant: 'outline',
    className: 'border-blue-500/50 bg-blue-500/10 text-blue-500',
  },
  in_progress: {
    label: 'In Progress',
    variant: 'outline',
    className: 'border-purple-500/50 bg-purple-500/10 text-purple-500',
  },
  completed: {
    label: 'Completed',
    variant: 'outline',
    className: 'border-green-500/50 bg-green-500/10 text-green-500',
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'outline',
    className: 'border-gray-500/50 bg-gray-500/10 text-gray-400',
  },
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
