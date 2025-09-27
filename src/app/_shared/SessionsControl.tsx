'use client';

import { useCallback } from 'react';
import { Button, Card } from '@components/ui';
import {
  enqueueReponseError,
  enqueueResponseMessage,
} from '@utils/enqueueResponseMessage';
import { handleAction } from '@utils/handleAction';
import { terminateSessions } from 'actions/user/terminateSessions';
import { useSession } from 'next-auth/react';

export const SessionsControl = () => {
  const { data, update } = useSession();
  const user = data?.user;

  const handleTerminate = useCallback(async () => {
    await handleAction(
      () => terminateSessions(),
      enqueueReponseError,
      enqueueResponseMessage,
    );
    update();
  }, [update]);

  if (!user) {
    return;
  }

  return (
    <Card className='w-full lg:w-[400px]'>
      <p className='mb-4 text-center text-3xl'>Sessions</p>
      {user.UserSession && user.UserSession?.sessionsIds.length > 1 ? (
        <>
          {user.UserSession?.sessionsIds.map((session) => {
            return (
              <p
                key={session}
                className={`${session === user.sessionId ? 'text-primary' : 'text-secondary'}`}
              >
                {session}
              </p>
            );
          })}
          <Button
            onClick={handleTerminate}
            title='Terminate all oher sessions'
            variant='secondary'
            className='mt-4'
          />
        </>
      ) : (
        <p className='text-warning'>You only have the current session</p>
      )}
    </Card>
  );
};
