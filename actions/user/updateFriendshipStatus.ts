'use server';

import { auth } from 'auth';
import { changeFriendRequestStatus } from 'data/friend-request';
import { CustomError, handleServerError, type Response } from '../response';
import type { FriendRequest } from '@prisma/client';

export const updateFriendRequest = async (
  id: FriendRequest['id'],
  status: FriendRequest['status'],
): Promise<Response> => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!session?.user || !userId) {
      throw new CustomError('Forbidden');
    }

    const friendRequest = await changeFriendRequestStatus(userId, id, status);
    if (!friendRequest) {
      throw new CustomError();
    }

    return { message: 'Successfully', ok: true };
  } catch (error) {
    return handleServerError(error);
  }
};
