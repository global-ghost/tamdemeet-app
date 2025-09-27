import { NextResponse } from 'next/server';
import { CustomError } from 'actions/response';
import { auth } from 'auth';
import { getAllFriendRequestByUser } from 'data/friend-request';
import { getUsersByIds, userMinimalDto } from 'data/user';
import { stringify } from 'superjson';
import type { FriendRequest } from '@prisma/client';
import type { UserMinimalDTO } from 'data/user';

export type FriendRequestWithUser = UserMinimalDTO & {
  friendRequestId: FriendRequest['id'];
};

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!session?.user || !userId) {
    throw new CustomError('Forbidden');
  }

  const friendRequests = await getAllFriendRequestByUser(userId);
  const usersIds = Array.from(
    new Set(
      friendRequests.map(({ receiverId, senderId }) =>
        receiverId === userId ? senderId : receiverId,
      ),
    ),
  );

  const users = await getUsersByIds(usersIds);
  const usersDTOs = new Map(
    users?.map((user) => [user.id, userMinimalDto(user)]),
  );

  const mapFriendRequests = (
    filterFn: (req: FriendRequest) => boolean,
    userIdSelector: (req: FriendRequest) => string,
  ): FriendRequestWithUser[] =>
    friendRequests
      .filter(filterFn)
      .map((request) => {
        const user = usersDTOs.get(userIdSelector(request));
        return user ? { ...user, friendRequestId: request.id } : null;
      })
      .filter((user): user is FriendRequestWithUser => user !== null);

  const acceptedRequests = [
    ...mapFriendRequests(
      ({ status, receiverId }) =>
        status === 'ACCEPTED' && receiverId === userId,
      ({ senderId }) => senderId,
    ),
    ...mapFriendRequests(
      ({ status, senderId }) => status === 'ACCEPTED' && senderId === userId,
      ({ receiverId }) => receiverId,
    ),
  ];

  const pendingIncomingRequests = mapFriendRequests(
    ({ status, receiverId }) => status === 'PENDING' && receiverId === userId,
    ({ senderId }) => senderId,
  );

  const pendingOutgoingRequests = mapFriendRequests(
    ({ status, senderId }) => status === 'PENDING' && senderId === userId,
    ({ receiverId }) => receiverId,
  );

  const response = {
    data: {
      acceptedRequests,
      pendingIncomingRequests,
      pendingOutgoingRequests,
    },
    ok: true,
  };

  const serialized = stringify(response);

  return new NextResponse(serialized, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
