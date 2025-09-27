import { db } from 'lib/db';
import type { FriendRequest, User } from '@prisma/client';

export const getAllFriendRequestByUser = async (userId: string) => {
  const friendRequests = await db.friendRequest.findMany({
    where: { OR: [{ receiverId: userId }, { senderId: userId }] },
  });

  return friendRequests;
};

export const createFreindRequest = async (
  senderId: string,
  receiverId: string,
) => {
  try {
    if (receiverId === senderId) {
      return null;
    }

    const alreadyExistingFriendRequest = await db.friendRequest.findFirst({
      where: {
        OR: [
          { receiverId, senderId },
          { receiverId: senderId, senderId: receiverId },
        ],
      },
    });

    if (alreadyExistingFriendRequest) {
      return null;
    }

    const friendRequest = await db.friendRequest.create({
      data: {
        senderId,
        receiverId,
        status: 'PENDING',
      },
    });

    return friendRequest;
  } catch (error) {
    return null;
  }
};

export const changeFriendRequestStatus = async (
  userId: User['id'],
  friendRequestId: FriendRequest['id'],
  status: FriendRequest['status'],
) => {
  try {
    const friendRequest = await db.friendRequest.findFirst({
      where: {
        OR: [
          {
            id: friendRequestId,
            receiverId: userId,
          },
          {
            id: friendRequestId,
            senderId: userId,
          },
        ],
      },
    });

    if (!friendRequest) {
      return null;
    }

    const updatedFriendRequest = await db.friendRequest.update({
      where: {
        id: friendRequestId,
      },
      data: {
        status,
      },
    });

    return updatedFriendRequest;
  } catch {
    return null;
  }
};
