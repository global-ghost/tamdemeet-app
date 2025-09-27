'use client';

import { useCallback } from 'react';
import Image from 'next/image';
import { Button, Card } from '@components/ui';
import { isSuccessResponse } from 'actions/response';
import { updateFriendRequest } from 'actions/user/updateFriendshipStatus';
import { fetchFriendRequests } from 'lib/api/fetchFriendRequests';
import useSWR from 'swr';
import type { FriendRequest } from '@prisma/client';

export const FreindRequestList = () => {
  const { data, mutate } = useSWR('/friends-requests', fetchFriendRequests);

  const handleRejectFriendship = useCallback(
    async (id: FriendRequest['id']) => {
      await updateFriendRequest(id, 'REJECTED');
      mutate();
    },
    [mutate],
  );

  const handleConfirmFriendship = useCallback(
    async (id: FriendRequest['id']) => {
      await updateFriendRequest(id, 'ACCEPTED');
      mutate();
    },
    [mutate],
  );

  return (
    <Card className='w-full lg:w-[500px]'>
      <p className='mb-4 text-center text-3xl'>Contacts</p>
      {isSuccessResponse(data) &&
        !!data.data.pendingIncomingRequests.length && (
          <div className='mt-[10px]'>
            <p className='text-warning'>Pending Incoming Requests:</p>
            {data.data.pendingIncomingRequests?.map((friendRequest) => (
              <div
                key={friendRequest.id}
                className='mt-[10px] flex flex-wrap gap-[20px]'
              >
                {friendRequest.image && (
                  <Image
                    src={friendRequest.image}
                    width={80}
                    height={80}
                    alt='avatar'
                  />
                )}
                <div>{friendRequest.name}</div>
                <div className='grow' />
                <div className='flex flex-col'>
                  <Button
                    onClick={() =>
                      handleConfirmFriendship(friendRequest.friendRequestId)
                    }
                    title='Confirm'
                    variant='secondary'
                    className='w-[150px]'
                  />

                  <Button
                    title='Reject'
                    className='w-[150px]'
                    onClick={() =>
                      handleRejectFriendship(friendRequest.friendRequestId)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}

      {isSuccessResponse(data) &&
        !!data.data.pendingOutgoingRequests.length && (
          <div className='mt-[10px]'>
            <p className='text-warning'>Pending Outgoing Requests:</p>
            {data.data.pendingOutgoingRequests.map((friendRequest) => (
              <div
                key={friendRequest.id}
                className='mt-[10px] flex flex-wrap gap-[20px]'
              >
                {friendRequest.image && (
                  <Image
                    src={friendRequest.image}
                    width={80}
                    height={80}
                    alt='avatar'
                  />
                )}
                <div>{friendRequest.name}</div>
                <div className='grow' />
                <div>
                  <Button
                    onClick={() =>
                      handleRejectFriendship(friendRequest.friendRequestId)
                    }
                    title='Cancel'
                    className='w-[150px]'
                  />
                </div>
              </div>
            ))}
          </div>
        )}

      {isSuccessResponse(data) && !!data.data.acceptedRequests.length ? (
        <div className='mt-[10px]'>
          <p className='text-warning'>Friendship:</p>
          {data.data.acceptedRequests.map((friendRequest) => (
            <div
              key={friendRequest.id}
              className='mt-[10px] flex flex-wrap gap-[20px]'
            >
              {friendRequest.image && (
                <Image
                  src={friendRequest.image}
                  width={80}
                  height={80}
                  alt='avatar'
                />
              )}
              <div>{friendRequest.name}</div>
              <div className='grow' />
              <div>
                <Button
                  onClick={() =>
                    handleRejectFriendship(friendRequest.friendRequestId)
                  }
                  title='Delete'
                  variant='error'
                  className='w-[150px]'
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className='mt-[20px] text-warning'>You dont have any contacts...</p>
      )}
    </Card>
  );
};
