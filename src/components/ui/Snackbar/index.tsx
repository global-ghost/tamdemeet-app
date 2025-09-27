'use client';

import { forwardRef, useCallback } from 'react';
import classNames from 'classnames';
import { Inconsolata } from 'next/font/google';
import {
  SnackbarContent,
  useSnackbar,
  type CustomContentProps,
} from 'notistack';
import { Button } from '../Button';
import { Icon, type IconName } from '../Icon';
import type { Color } from '../types';

const inconsaolata = Inconsolata({
  subsets: ['latin'],
});

const mapSnackbarIcon: Partial<
  Record<CustomContentProps['variant'], IconName>
> = {
  error: 'warning',
  warning: 'warning',
  success: 'checkmark',
};

const mapSnackbarIconColor: Partial<
  Record<CustomContentProps['variant'], Color>
> = {
  error: 'error',
  warning: 'warning',
  success: 'secondary',
};

export const Snackbar = forwardRef<HTMLDivElement, CustomContentProps>(
  ({ id, ...props }, ref) => {
    const { closeSnackbar } = useSnackbar();

    const handleDismiss = useCallback(() => {
      closeSnackbar(id);
    }, [id, closeSnackbar]);

    return (
      <SnackbarContent ref={ref}>
        <div
          className={classNames(
            'flex grow items-center justify-between p-3',
            { 'bg-errorDark': props.variant === 'error' },
            { 'bg-warningDark': props.variant === 'warning' },
            { 'bg-secondaryDark': props.variant === 'success' },
          )}
        >
          <div className='animate-pulse'>
            <Icon
              color={mapSnackbarIconColor[props.variant]}
              size={30}
              icon={mapSnackbarIcon[props.variant]!}
            />
          </div>
          <p
            className={classNames(
              `${inconsaolata.className} mx-4`,
              { 'text-error': props.variant === 'error' },
              { 'text-warning': props.variant === 'warning' },
              { 'text-secondary': props.variant === 'success' },
            )}
          >
            {props.message}
          </p>
          <Button
            variant='white'
            icon='close'
            iconSize={14}
            onClick={handleDismiss}
          />
        </div>
      </SnackbarContent>
    );
  },
);

Snackbar.displayName = 'Snackbar';
