'use client';

import { useEffect, useState } from 'react';
import { Button } from '@components/ui';
import { signIn } from 'next-auth/react';
import { enqueueSnackbar } from 'notistack';

export const GoogleButton = () => {
  const [error, setError] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  useEffect(() => {
    if (error) {
      setErrorMessage(
        error === 'OAuthAccountNotLinked'
          ? 'Email already in use with different provider'
          : 'Something went wrong!',
      );
    } else {
      setErrorMessage(null);
    }
  }, [error]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setError(params.get('error'));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      enqueueSnackbar({ message: errorMessage, variant: 'error' });
    }
  }, [errorMessage]);

  return (
    <Button
      onClick={() => signIn('google')}
      title='Sign in with Google'
      icon='google'
      variant='secondary'
      className='w-full'
    />
  );
};
