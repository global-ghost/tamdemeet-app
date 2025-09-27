'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormTextField,
  useForm,
  FormCodeField,
  FormSubmitButton,
} from '@components/rhf';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  enqueueReponseError,
  enqueueResponseMessage,
} from '@utils/enqueueResponseMessage';
import { handleAction } from '@utils/handleAction';
import { removeEmptyStrings } from '@utils/removeEmptyStrings';
import { login } from 'actions/auth/login';
import { enqueueSnackbar } from 'notistack';
import { LoginSchema } from 'schemas';
import type * as z from 'zod';

export const SignInForm = () => {
  const [isTwoFactor, setIsTwoFactor] = useState(false);
  const { push } = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { identifier: '', password: '', code: '' },
  });

  const { code } = form.watch();

  const handleSubmit = useCallback(
    async (values: z.infer<typeof LoginSchema>) => {
      if (isTwoFactor && code === '') {
        enqueueSnackbar({
          message: 'You need to write code 2FA code',
          variant: 'warning',
        });
        return;
      }
      await handleAction(
        () => login(removeEmptyStrings(values)),
        enqueueReponseError,
        (response) => {
          if (response?.data?.twoFactor) {
            setIsTwoFactor(true);
            enqueueResponseMessage(response);
            return;
          }

          push('/map');
        },
      );
    },
    [code, isTwoFactor, push],
  );

  return (
    <Form form={form} onSubmit={handleSubmit} className='mt-8'>
      <FormTextField name='identifier' label='Login / Email' required />
      <FormTextField
        name='password'
        label='Password'
        type='password'
        required
      />
      {isTwoFactor && (
        <>
          <p className='mb-2 text-warning'>2FA code:</p>
          <FormCodeField name='code' inputMode='numeric' fields={4} />
        </>
      )}
      <FormSubmitButton
        title='Sign in'
        className='mt-2 w-full'
        variant='primary'
      />
      <div className='my-2'>
        <Link
          href='/auth/reset-password'
          className=' text-sm text-primary hover:underline'
        >
          Forgot password?
        </Link>
      </div>
    </Form>
  );
};
