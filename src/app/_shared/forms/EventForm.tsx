'use client';

import { useCallback, useMemo } from 'react';
import {
  Form,
  FormDateField,
  FormSelectBox,
  FormSubmitButton,
  FormTextField,
  useForm,
} from '@components/rhf';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  enqueueReponseError,
  enqueueResponseMessage,
} from '@utils/enqueueResponseMessage';
import { handleAction } from '@utils/handleAction';
import { isSuccessResponse } from 'actions/response';
import { createUserEvent } from 'actions/user/createEvent';
import { updateUserEvent } from 'actions/user/updateEvent';
import { fetchEvents } from 'lib/api/fetchEvents';
import { fetchFriendRequests } from 'lib/api/fetchFriendRequests';
import { CreateUpdateEventSchema } from 'schemas';
import useSWR from 'swr';
import type { FormSelectBoxProps } from '@components/rhf';
import type { DialogProps } from '@components/ui';
import type { Event } from '@prisma/client';
import type { FriendRequestWithUser } from 'src/app/api/get/freindRequests/route';
import type * as z from 'zod';

type EventFormProps = {
  editMode?: boolean;
  selectedEvent?: Event;
  eventCoords?: google.maps.LatLngLiteral | null;
} & Pick<DialogProps, 'onClose'>;

const toInvitedUserIdsOptions = (
  users?: FriendRequestWithUser[],
): FormSelectBoxProps['options'] => {
  if (!users) {
    return [];
  }
  return users.map((item) => ({
    label: item.name ?? item.email,
    value: item.id,
  }));
};

export const EventForm = ({
  selectedEvent,
  eventCoords,
  editMode,
  onClose,
}: EventFormProps) => {
  const { data: contactsData } = useSWR(
    '/friends-requests',
    fetchFriendRequests,
  );

  const { mutate } = useSWR('/user-events', fetchEvents);

  const contactsOptions = useMemo(() => {
    const acceptedRequests = isSuccessResponse(contactsData)
      ? contactsData.data.acceptedRequests
      : [];

    return toInvitedUserIdsOptions(acceptedRequests);
  }, [contactsData]);

  const defaultValues: z.infer<typeof CreateUpdateEventSchema> = useMemo(
    () => ({
      lat: selectedEvent?.lat ?? eventCoords?.lat ?? 0,
      lng: selectedEvent?.lng ?? eventCoords?.lng ?? 0,
      title: selectedEvent?.title ?? '',
      description: selectedEvent?.description ?? '',
      date: selectedEvent?.date ?? undefined,
      invitedUserIds: selectedEvent?.invitedUserIds,
    }),
    [
      eventCoords?.lat,
      eventCoords?.lng,
      selectedEvent?.date,
      selectedEvent?.description,
      selectedEvent?.invitedUserIds,
      selectedEvent?.lat,
      selectedEvent?.lng,
      selectedEvent?.title,
    ],
  );

  const form = useForm<z.infer<typeof CreateUpdateEventSchema>>({
    resolver: zodResolver(CreateUpdateEventSchema),
    defaultValues,
  });

  const handleSubmit = useCallback(
    async (values: z.infer<typeof CreateUpdateEventSchema>) => {
      await handleAction(
        () =>
          selectedEvent
            ? updateUserEvent(selectedEvent.id, values)
            : createUserEvent(values),
        enqueueReponseError,
        (data) => {
          onClose();
          mutate();
          enqueueResponseMessage(data);
        },
      );
    },
    [mutate, onClose, selectedEvent],
  );

  return (
    <Form
      form={form}
      onSubmit={handleSubmit}
      className='mt-[20px] w-full lg:w-[400px]'
    >
      {editMode && <FormTextField name='title' label='Title' required />}
      {editMode ? (
        <FormTextField name='description' label='Description' />
      ) : (
        <p>{form.getValues().description}</p>
      )}
      {editMode && (
        <FormSelectBox
          name='invitedUserIds'
          label='Invated Users'
          isMulti
          options={contactsOptions}
        />
      )}
      {editMode ? (
        <div className='my-2'>
          <FormDateField name='date' label='Start Time' />
        </div>
      ) : (
        <p>Date: {form.getValues().date?.toLocaleString()}</p>
      )}

      {editMode && <FormSubmitButton title='Save' />}
    </Form>
  );
};
