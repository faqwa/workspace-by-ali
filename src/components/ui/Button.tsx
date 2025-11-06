import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

/**
 * Button variants using class-variance-authority
 * Provides consistent, type-safe button styling across the app
 */
const buttonVariants = cva(
  // Base styles applied to all buttons
  'btn inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-[#22c55e] hover:bg-[#16a34a] text-white border-0 shadow-sm hover:shadow-md active:scale-95',
        secondary: 'bg-[#3b82f6] hover:bg-[#2563eb] text-white border-0 shadow-sm hover:shadow-md active:scale-95',
        danger: 'bg-error hover:bg-error/90 text-white border-0 shadow-sm hover:shadow-md active:scale-95',
        outline: 'btn-outline hover:bg-base-200 active:scale-95',
        ghost: 'btn-ghost hover:bg-base-200 active:scale-95',
        link: 'btn-link no-underline hover:underline',
      },
      size: {
        sm: 'btn-sm text-sm',
        md: 'btn-md',
        lg: 'btn-lg text-lg',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Button component with consistent styling and variants
 *
 * @example
 * // Primary button
 * <Button variant="primary">Save Changes</Button>
 *
 * @example
 * // Button with loading state
 * <Button variant="danger" isLoading loadingText="Deleting...">
 *   Delete Account
 * </Button>
 *
 * @example
 * // Button with icons
 * <Button leftIcon={<PlusIcon />}>Add Project</Button>
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading,
      loadingText,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            {loadingText || children}
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
