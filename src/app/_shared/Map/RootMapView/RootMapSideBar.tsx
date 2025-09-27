import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@components/ui';
import { DEFAULT_AVATAR_SRC } from '@shared/AvatarSettings';
import { getRelativeDateLabel } from '@utils/getRelativeDateLabel';
import { Tooltip } from 'react-tooltip';
import type { Event } from '@prisma/client';
import type { FriendRequestWithUser } from 'src/app/api/get/freindRequests/route';

export const RootMapSideBar: React.FunctionComponent<{
  contacts?: FriendRequestWithUser[];
  events?: Event[];
  updateMapCenter: (coords: { lat: number; lng: number }) => void;
}> = ({ contacts, updateMapCenter, events }) => {
  return (
    <Card className='flex size-full flex-col pb-6'>
      <p className='text-secondary'>CONTACTS:</p>
      {contacts?.length ? (
        <div className='mt-[8px] flex max-h-[230px] flex-col justify-center gap-[14px] overflow-auto'>
          {contacts
            .filter((contact) => contact.UserLocation)
            .map((contact) => (
              <button
                className='mt-[4px] flex items-center gap-[10px]'
                key={contact.id}
                onClick={() =>
                  updateMapCenter({
                    lat: contact.UserLocation!.lat,
                    lng: contact.UserLocation!.lng,
                  })
                }
              >
                <Image
                  className='shrink-0 rounded-full'
                  width={70}
                  height={70}
                  alt='avatar'
                  src={contact.image ?? DEFAULT_AVATAR_SRC}
                />

                <p className='text-start '>{contact.name}</p>
                <div className='grow' />
                <div className='text-sm'>
                  <p className='text-gray'>Geolocation updated at: </p>
                  <p className='text-gray'>
                    {getRelativeDateLabel(contact.UserLocation!.updatedAt)}
                  </p>
                </div>
              </button>
            ))}
        </div>
      ) : (
        <div>
          <p className='text-warning'>
            You dont have any contacts with shared location...
          </p>
          <div className='mt-[16px]'>
            <Link
              className=' text-[14px] text-primary hover:underline'
              href={'/contacts'}
            >
              ADD CONTACT
            </Link>
          </div>
        </div>
      )}

      <div className='mt-[60px]'>
        <p className='text-secondary'>EVENTS:</p>
        {events?.length ? (
          <div className='mt-[8px] flex max-h-[280px] flex-col gap-[14px] overflow-auto'>
            {events.map((event) => (
              <button
                key={event.id}
                className='flex items-center gap-[10px]'
                onClick={() =>
                  updateMapCenter({
                    lat: event.lat,
                    lng: event.lng,
                  })
                }
              >
                <div className='flex flex-col gap-[4px] text-start'>
                  <p className='text-lg text-primaryLight'>{event.title}</p>
                  {event.date && (
                    <p className='text-sm text-gray'>
                      Date: {new Date(event.date).toLocaleString()}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className='text-warning'>You don&apos;t have any events now...</p>
        )}
      </div>

      <div className='grow'></div>
      <div className='flex justify-end '>
        <a
          id='my-anchor-element'
          className='size-10 rounded-full border border-warningDark text-center text-[24px] font-bold
            text-warning'
        >
          ?
        </a>
        <Tooltip
          anchorSelect='#my-anchor-element'
          clickable
          style={{ maxWidth: '100vw' }}
          variant='light'
          content='✨ Want to add an event? Just double-click on the map!'
        />
      </div>
    </Card>
  );
};
