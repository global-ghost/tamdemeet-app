import { useCallback, useMemo } from 'react';
import { Button, Dialog } from '@components/ui';
import { EventForm } from '@shared/forms/EventForm';
import { isSuccessResponse } from 'actions/response';
import { fetchEvents } from 'lib/api/fetchEvents';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { EventMap } from './EventMap';
import type { EventMapProps } from './EventMap';
import type { DialogProps } from '@components/ui';

export const EventDialog: React.FunctionComponent<
  Pick<DialogProps, 'onClose'> & EventMapProps & { eventId: string | null }
> = ({ onClose, eventCoords, updateEventCoords, eventId }) => {
  const { data } = useSession();
  const userId = data?.user?.id;

  const handleUpdateEventCoors = useCallback(
    (coords: EventMapProps['eventCoords']) => {
      updateEventCoords(coords);
    },
    [updateEventCoords],
  );

  const hanldeCloseEventCoords = useCallback(() => {
    onClose();
  }, [onClose]);

  const { data: eventsData } = useSWR('/user-events', fetchEvents);

  const selectedEvent = useMemo(
    () =>
      isSuccessResponse(eventsData)
        ? eventsData?.data?.find((event) => event.id === eventId)
        : undefined,

    [eventId, eventsData],
  );

  const isEdit = selectedEvent && selectedEvent.ownerId === userId;
  const isCreate = !selectedEvent;

  return (
    <Dialog open={true} onClose={hanldeCloseEventCoords}>
      <div className='px-2 pb-4'>
        <div className='flex items-center pb-2'>
          <h2 className='text-lg'>
            {isEdit
              ? 'Edit Event'
              : selectedEvent
                ? selectedEvent.title
                : 'Create Event'}
          </h2>
          <div className='grow' />
          <Button
            className='p-3'
            onClick={onClose}
            icon='close'
            iconColor='error'
          />
        </div>

        <div className='mx-auto mb-[2] size-[300px]'>
          <EventMap
            eventCoords={
              selectedEvent
                ? { lat: selectedEvent.lat, lng: selectedEvent.lng }
                : eventCoords
            }
            updateEventCoords={handleUpdateEventCoors}
          />
        </div>

        <EventForm
          editMode={isEdit || isCreate}
          eventCoords={eventCoords}
          selectedEvent={selectedEvent}
          onClose={onClose}
        />
      </div>
    </Dialog>
  );
};
