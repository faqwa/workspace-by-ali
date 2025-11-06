import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Base Skeleton component for loading states
 *
 * @example
 * <Skeleton variant="text" width="100%" height={20} />
 * <Skeleton variant="circular" width={40} height={40} />
 * <Skeleton variant="rectangular" className="w-full h-48" />
 */
export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-base-300 rounded';

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  );
}

/**
 * SkeletonText - For text content loading
 */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          height={16}
          width={i === lines - 1 ? '80%' : '100%'}
        />
      ))}
    </div>
  );
}

/**
 * SkeletonCard - For project/update cards
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('card bg-base-100 shadow-sm p-6', className)}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" height={20} width="70%" />
          <Skeleton variant="text" height={16} width="40%" />
        </div>
      </div>

      {/* Body */}
      <SkeletonText lines={2} className="mb-4" />

      {/* Footer */}
      <div className="flex items-center gap-2">
        <Skeleton variant="rectangular" width={60} height={24} className="rounded-full" />
        <Skeleton variant="rectangular" width={80} height={24} className="rounded-full" />
      </div>
    </div>
  );
}

/**
 * SkeletonList - For timeline/activity lists
 */
export function SkeletonList({
  items = 3,
  className,
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-start gap-4">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" height={18} width="60%" />
            <Skeleton variant="text" height={14} width="90%" />
            <Skeleton variant="text" height={14} width="70%" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * SkeletonStat - For dashboard stat cards
 */
export function SkeletonStat({ className }: { className?: string }) {
  return (
    <div className={cn('stat bg-base-100 rounded-lg', className)}>
      <Skeleton variant="text" height={16} width="40%" className="mb-2" />
      <Skeleton variant="text" height={32} width="60%" className="mb-1" />
      <Skeleton variant="text" height={14} width="50%" />
    </div>
  );
}

/**
 * SkeletonTable - For table rows
 */
export function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="text"
              height={16}
              width={colIndex === 0 ? '25%' : '100%'}
              className="flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
