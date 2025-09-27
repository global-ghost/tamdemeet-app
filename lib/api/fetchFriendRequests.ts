import { parse } from 'superjson';
import type { FriendRequestWithUser } from 'src/app/api/get/freindRequests/route';

type SuccessResponse = {
  ok: true;
  data: {
    acceptedRequests: FriendRequestWithUser[];
    pendingIncomingRequests: FriendRequestWithUser[];
    pendingOutgoingRequests: FriendRequestWithUser[];
  };
};

type ErrorResponse = {
  ok: false;
  error: string;
};

export type FriendRequestsResponse = SuccessResponse | ErrorResponse;

export const fetchFriendRequests =
  async (): Promise<FriendRequestsResponse> => {
    const res = await fetch('/api/get/freindRequests', {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => null);
      return {
        ok: false,
        error: errorBody?.error || 'Failed to fetch friend requests',
      };
    }

    const raw = await res.text();
    const parsed = parse<FriendRequestsResponse>(raw);
    return parsed;
  };
