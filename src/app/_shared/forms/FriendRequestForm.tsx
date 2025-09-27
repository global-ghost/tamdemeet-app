'use client';

import { useCallback } from 'react';
import {
  Form,
  FormTextField,
  useForm,
  FormSubmitButton,
} from '@components/rhf';
import { Card } from '@components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  enqueueReponseError,
  enqueueResponseMessage,
} from '@utils/enqueueResponseMessage';
import { handleAction } from '@utils/handleAction';
import { requestToFriendship } from 'actions/user/createFriendRequest';
import { CreateFriendRequestSchema } from 'schemas';
import useSWR from 'swr';
import type * as z from 'zod';

export const FriendRequestForm = () => {
  const { mutate } = useSWR('/friends-requests');
  const form = useForm<z.infer<typeof CreateFriendRequestSchema>>({
    resolver: zodResolver(CreateFriendRequestSchema),
    values: {
      identifier: '',
    },
  });

  const handleSubmit = useCallback(
    async (values: z.infer<typeof CreateFriendRequestSchema>) => {
      await handleAction(
        () => requestToFriendship(values),
        enqueueReponseError,
        enqueueResponseMessage,
      );
      mutate();
    },
    [mutate],
  );

  return (
    <Form form={form} onSubmit={handleSubmit} className='w-full lg:w-[400px]'>
      <Card>
        <p className='mb-6 text-center text-3xl'>Add new contact</p>
        <FormTextField name='identifier' label='Login / Email' required />
        <FormSubmitButton className='mt-[10px]' title='Send request' />
      </Card>
    </Form>
  );
};
