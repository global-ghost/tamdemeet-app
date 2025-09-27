import type { ReactNode } from 'react';
import classNames from 'classnames';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon';

export type ButtonProps = {
  title?: ReactNode;
  icon?: IconProps['icon'];
  iconColor?: IconProps['color'];
  onClick?: VoidFunction;
  type?: 'submit' | 'button';
  variant?: 'primary' | 'secondary' | 'white' | 'gray' | 'error';
  disabled?: boolean;
  className?: string;
  loading?: boolean;
  iconSize?: number;
  border?: boolean;
};

export const Button: React.FunctionComponent<ButtonProps> = ({
  type = 'button',
  onClick,
  title,
  icon,
  className,
  disabled = false,
  loading = false,
  variant = 'primary',
  border = true,
  iconSize = 22,
  iconColor,
}) => {
  const isDisabled = loading || disabled;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={classNames(
        'rounded-sm p-2 active:outline-white',
        {
          'outline-0': !title,
          'outline-1': title,
          'hover:outline': border,
          border: border && title,
          'border-primary outline-primary':
            !isDisabled && variant === 'primary',
          'border-secondary outline-secondary':
            !isDisabled && variant === 'secondary',
          'border-error outline-error': !isDisabled && variant === 'error',
          'border-disabled hover:pointer-events-none': isDisabled,
        },
        className,
      )}
    >
      <div className='flex w-full items-center justify-center gap-4 '>
        {icon && !loading && (
          <Icon
            icon={icon}
            size={iconSize}
            color={isDisabled ? 'disabled' : iconColor ?? variant}
          />
        )}

        {title && (
          <div
            className={classNames({
              'text-disabled': isDisabled,
              'text-primary': !isDisabled && variant === 'primary',
              'text-secondary': !isDisabled && variant === 'secondary',
              'text-error': !isDisabled && variant === 'error',
            })}
          >
            {title}
          </div>
        )}
      </div>
    </button>
  );
};
