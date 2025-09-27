'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  enqueueReponseError,
  enqueueResponseMessage,
} from '@utils/enqueueResponseMessage';
import { handleAction } from '@utils/handleAction';
import { verifyEmail } from 'actions/auth/verifyEmail';
import Loader from 'react-spinners/BeatLoader';

export default function Page() {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const handleEmailVerify = useCallback(
    async (token: string | null) => {
      if (token) {
        await handleAction(
          () => verifyEmail(token),
          enqueueReponseError,
          (response) => {
            enqueueResponseMessage(response);
            push('/auth/sign-in');
          },
        );
      }
      setIsLoading(false);
    },
    [push],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get('token'));
  }, []);

  useEffect(() => {
    if (token) {
      handleEmailVerify(token);
    }
  }, [handleEmailVerify, token]);

  return (
    <>
      <p className='text-center text-3xl'> Email verification</p>
      {isLoading && (
        <div className='mt-3 flex justify-center'>
          <Loader color='#ebebeb' />
        </div>
      )}
    </>
  );
}
