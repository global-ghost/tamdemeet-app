'use client';

import { useCallback } from 'react';
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
import { removeEmptyStrings } from '@utils/removeEmptyStrings';
import { register } from 'actions/auth/register';
import { RegisterSchema } from 'schemas';
import type * as z from 'zod';

export const SignUpForm = () => {
  const { push } = useRouter();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { email: '', login: '', password: '', confirmPassword: '' },
  });

  const handleSubmit = useCallback(
    async (values: z.infer<typeof RegisterSchema>) => {
      await handleAction(
        () => register(removeEmptyStrings(values)),
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
    <Form form={form} onSubmit={handleSubmit} className='mt-8'>
      <FormTextField name='login' label='Login' />
      <FormTextField name='email' label='Email' required />
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
      <FormSubmitButton
        title='Sign up'
        className='mt-2 w-full'
        variant='primary'
      />
    </Form>
  );
};
