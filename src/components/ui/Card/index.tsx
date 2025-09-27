import type { HTMLAttributes, PropsWithChildren } from 'react';
import classNames from 'classnames';

export const Card: React.FunctionComponent<
  PropsWithChildren<HTMLAttributes<HTMLDivElement>>
> = ({ children, className, ...props }) => (
  <div
    {...props}
    className={classNames(
      'border border-cardBorder bg-card px-8 py-8 pb-10',
      className,
    )}
  >
    {children}
  </div>
);
