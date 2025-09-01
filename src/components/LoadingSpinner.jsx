import { cn } from '@/lib/utils.js';

/**
 * Loading Spinner Component
 * @param {object} props - Component props
 * @param {string} props.size - Size of spinner (sm, md, lg, xl)
 * @param {string} props.color - Color of spinner (primary, secondary, success, warning, error)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.text - Loading text to display
 * @param {boolean} props.showText - Whether to show loading text
 * @returns {JSX.Element} Loading spinner component
 */
export function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  className = '',
  text = 'Loading...',
  showText = false 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-primary-600',
    secondary: 'border-neutral-600',
    success: 'border-success-600',
    warning: 'border-warning-600',
    error: 'border-error-600'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-transparent',
          sizeClasses[size],
          colorClasses[color],
          'border-t-current'
        )}
        role="status"
        aria-label="Loading"
      />
      {showText && (
        <p className={cn('mt-2 text-neutral-600', textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );
}

/**
 * Page Loading Component
 * @param {object} props - Component props
 * @param {string} props.message - Loading message
 * @returns {JSX.Element} Page loading component
 */
export function PageLoading({ message = 'Loading page...' }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <LoadingSpinner size="xl" color="primary" showText text={message} />
      </div>
    </div>
  );
}

/**
 * Button Loading Component
 * @param {object} props - Component props
 * @param {string} props.text - Loading text
 * @param {string} props.size - Size of spinner
 * @returns {JSX.Element} Button loading component
 */
export function ButtonLoading({ text = 'Loading...', size = 'sm' }) {
  return (
    <div className="flex items-center space-x-2">
      <LoadingSpinner size={size} color="primary" />
      <span className="text-sm">{text}</span>
    </div>
  );
}

/**
 * Skeleton Loading Component
 * @param {object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.lines - Number of skeleton lines
 * @returns {JSX.Element} Skeleton loading component
 */
export function SkeletonLoading({ className = '', lines = 3 }) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'h-4 bg-neutral-200 rounded animate-pulse',
            index === 0 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

/**
 * Card Skeleton Component
 * @param {object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Card skeleton component
 */
export function CardSkeleton({ className = '' }) {
  return (
    <div className={cn('card p-6', className)}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-neutral-200 rounded-full animate-pulse" />
        <div className="flex-1">
          <div className="h-4 bg-neutral-200 rounded w-3/4 animate-pulse mb-2" />
          <div className="h-3 bg-neutral-200 rounded w-1/2 animate-pulse" />
        </div>
      </div>
      <SkeletonLoading lines={3} />
    </div>
  );
}

/**
 * Table Skeleton Component
 * @param {object} props - Component props
 * @param {number} props.rows - Number of skeleton rows
 * @param {number} props.columns - Number of skeleton columns
 * @returns {JSX.Element} Table skeleton component
 */
export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-neutral-50 border-b">
        {Array.from({ length: columns }).map((_, index) => (
          <div
            key={index}
            className="h-4 bg-neutral-200 rounded animate-pulse"
          />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-4 gap-4 p-4 border-b last:border-b-0"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className={cn(
                'h-4 bg-neutral-200 rounded animate-pulse',
                colIndex === 0 ? 'w-3/4' : 'w-full'
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
