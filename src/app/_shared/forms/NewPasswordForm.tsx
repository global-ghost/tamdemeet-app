'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormTextField,
  useForm,
  FormSubmitButton,
} from '@components/rhf';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  enqueueReponseError,
  enqueueResponseMessage,
} from '@utils/enqueueResponseMessage';
import { handleAction } from '@utils/handleAction';
import { setNewPassword } from 'actions/auth/setNewPassword';
import { NewPasswordSchema } from 'schemas';
import type * as z from 'zod';

export const NewPasswordForm = () => {
  const { push } = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const handleSubmit = useCallback(
    async (values: z.infer<typeof NewPasswordSchema>) => {
      if (token) {
        await handleAction(
          () => setNewPassword(values, token),
          enqueueReponseError,
          (response) => {
            enqueueResponseMessage(response);
            push('/auth/sign-in');
          },
        );
      }
    },
    [push, token],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get('token'));
  }, []);

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <p className='mb-6 text-center text-3xl'> New password</p>
      <FormTextField
        name='password'
        label='Password'
        type='password'
        required
      />
      <FormTextField
        name='confirmPassword'
        label='Confirm Password'
        type='password'
        required
      />
      <div className='mt-5 flex justify-center gap-2'>
        <FormSubmitButton title='Update password' className=' w-40' />
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
