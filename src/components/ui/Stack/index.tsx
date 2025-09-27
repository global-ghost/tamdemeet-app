import type { PropsWithChildren } from 'react';

export const Stack: React.FunctionComponent<PropsWithChildren<object>> = ({
  children,
}) => <div className='flex flex-col gap-2'>{children}</div>;
