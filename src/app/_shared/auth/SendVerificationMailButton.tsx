'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui';
import {
  enqueueReponseError,
  enqueueResponseMessage,
} from '@utils/enqueueResponseMessage';
import { handleAction } from '@utils/handleAction';
import { resendVerificationEmail } from 'actions/auth/resendVerificationMail';

export const SendVerificationButton: React.FunctionComponent<{
  email: string;
}> = ({ email }) => {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSendVerificationMail = useCallback(async () => {
    setIsLoading(true);

    await handleAction(
      () => resendVerificationEmail(email),
      enqueueReponseError,
      (response) => {
        enqueueResponseMessage(response);
        push('/auth/sign-in');
      },
    );

    setIsLoading(false);
  }, [email, push]);

  return (
    <Button
      title='Send'
      loading={isLoading}
      onClick={handleSendVerificationMail}
    />
  );
};
