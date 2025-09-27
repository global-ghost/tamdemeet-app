'use client';

import type { PropsWithChildren } from 'react';
import { Snackbar } from '@components/ui';
// import { SessionProvider } from 'next-auth/react';
import { SnackbarProvider, closeSnackbar } from 'notistack';

const Providers: React.FunctionComponent<PropsWithChildren<object>> = ({
  children,
}) => {
  return (
    // <SessionProvider>
    <SnackbarProvider
      Components={{
        error: Snackbar,
        warning: Snackbar,
        success: Snackbar,
      }}
      hideIconVariant
      maxSnack={10}
      autoHideDuration={10000}
      action={(snackbarId) => (
        <button onClick={() => closeSnackbar(snackbarId)}>x</button>
      )}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      {children}
    </SnackbarProvider>
    // </SessionProvider>
  );
};

export default Providers;
