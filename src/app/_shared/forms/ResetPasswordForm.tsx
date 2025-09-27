'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormSubmitButton,
  FormTextField,
  useForm,
} from '@components/rhf';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  enqueueReponseError,
  enqueueResponseMessage,
} from '@utils/enqueueResponseMessage';
import { handleAction } from '@utils/handleAction';
import { resetPassword } from 'actions/auth/resetPassword';
import { ResetPasswordSchema } from 'schemas';
import type * as z from 'zod';

export const ResetPasswordForm = () => {
  const { push } = useRouter();
  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { email: '' },
  });

  const handleSubmit = useCallback(
    async (values: z.infer<typeof ResetPasswordSchema>) => {
      await handleAction(
        () => resetPassword(values),
        enqueueReponseError,
        (response) => {
          enqueueResponseMessage(response);
          push('/auth/sign-in');
        },
      );
    },
    [push],
  );

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <p className='text-center text-3xl'> Reset password</p>
      <p className='mb-3 mt-2 text-center text-warning'>
        You will receive an email with instructions to reset your password
      </p>
      <FormTextField name='email' label='Email' required />
      <div className='mt-5 flex justify-center gap-2'>
        <FormSubmitButton title='Send' className=' w-40' />
      </div>
      <div className='mt-5 flex justify-center'>
        <Link
          href={'/auth/sign-in'}
          title='Back to sign in'
          className='text-primary hover:underline'
        >
          Go back to sign in
        </Link>
      </div>
    </Form>
  );
};
