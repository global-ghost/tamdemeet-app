'use client';

import { useCallback } from 'react';
import {
  Form,
  FormCheckbox,
  FormSubmitButton,
  FormTextField,
  useForm,
} from '@components/rhf';
import { Card, Stack } from '@components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  enqueueReponseError,
  enqueueResponseMessage,
} from '@utils/enqueueResponseMessage';
import { handleAction } from '@utils/handleAction';
import { removeEmptyStrings } from '@utils/removeEmptyStrings';
import { updateUserSettings } from 'actions/user/updateUserSettings';
import { useSession } from 'next-auth/react';
import { UpdateUserSettingsSchema } from 'schemas';
import type * as z from 'zod';

export const UpdateUserSettingsForm = () => {
  const { data, update } = useSession();
  const user = data?.user;

  const form = useForm<z.infer<typeof UpdateUserSettingsSchema>>({
    resolver: zodResolver(UpdateUserSettingsSchema),
    values: {
      name: user?.name ?? '',
      isTwoFactorEnabled: user?.isTwoFactorEnabled ?? false,
    },
  });

  const handleSubmit = useCallback(
    async (values: z.infer<typeof UpdateUserSettingsSchema>) => {
      if (user?.id) {
        await handleAction(
          () => updateUserSettings(removeEmptyStrings(values)),
          enqueueReponseError,
          enqueueResponseMessage,
        );
        update();
      }
    },
    [update, user?.id],
  );

  if (!user) {
    return null;
  }

  return (
    <Form className='w-full lg:w-[400px]' form={form} onSubmit={handleSubmit}>
      <Card className='w-full'>
        <Stack>
          <p className='mb-4 text-center text-3xl'>User</p>
          <FormTextField name='name' label='Name' />
          {user.isTwoFactorAvailable && (
            <div>
              <FormCheckbox
                name='isTwoFactorEnabled'
                label='Use two factor auth'
              />
              <p className='mt-1 text-sm text-warning'>
                During login, a code will be sent to your email for verification
              </p>
            </div>
          )}
          <FormSubmitButton title='Update' className='mt-6' variant='primary' />
        </Stack>
      </Card>
    </Form>
  );
};
