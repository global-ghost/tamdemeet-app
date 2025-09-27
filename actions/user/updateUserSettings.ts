'use server';

import { auth } from 'auth';
import { userDto, type UserDto } from 'data/user';
import { db } from 'db';
import { UpdateUserSettingsSchema } from 'schemas';
import { CustomError, handleServerError, type Response } from '../response';
import type * as z from 'zod';

export const updateUserSettings = async (
  values: z.infer<typeof UpdateUserSettingsSchema>,
): Promise<Response<UserDto>> => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!session?.user) {
      throw new CustomError('Forbidden');
    }

    const validatedFields = UpdateUserSettingsSchema.safeParse(values);
    if (!validatedFields.success) {
      throw new CustomError('Invalid Fields');
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: values,
    });

    return {
      ok: true,
      message: 'Updated successfully',
      data: userDto(updatedUser),
    };
  } catch (error) {
    return handleServerError({ error });
  }
};
