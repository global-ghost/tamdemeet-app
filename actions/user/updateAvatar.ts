'use server';

import { auth } from 'auth';
import { db } from 'db';
import { CustomError, handleServerError, type Response } from '../response';

export const updateUserSettings = async (src: string): Promise<Response> => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!session?.user) {
      throw new CustomError('Forbidden');
    }

    await db.user.update({
      where: { id: userId },
      data: { image: src },
    });

    return {
      ok: true,
      message: 'Updated successfully',
    };
  } catch (error) {
    return handleServerError(error);
  }
};
