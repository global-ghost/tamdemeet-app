'use server';

import { auth } from 'auth';
import { createFreindRequest } from 'data/friend-request';
import { getUserByIdentifier } from 'data/user';
import { CustomError, handleServerError, type Response } from '../response';
import type { CreateFriendRequestSchema } from 'schemas';
import type * as z from 'zod';

export const requestToFriendship = async (
  values: z.infer<typeof CreateFriendRequestSchema>,
): Promise<Response> => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!session?.user || !userId) {
      throw new CustomError('Forbidden');
    }

    const receiver = await getUserByIdentifier(values.identifier);

    if (!receiver) {
      throw new CustomError('User not found');
    }

    const friendRequest = await createFreindRequest(userId, receiver.id);
    if (!friendRequest) {
      throw new CustomError();
    }

    return { message: 'Request was sended', ok: true };
  } catch (error) {
    return handleServerError(error);
  }
};
