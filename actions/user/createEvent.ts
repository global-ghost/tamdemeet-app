'use server';

import { CustomError, handleServerError } from 'actions/response';
import { auth } from 'auth';
import { createEvent } from 'data/events';
import type { Response } from 'actions/response';
import type { CreateUpdateEventSchema } from 'schemas';
import type * as z from 'zod';

export const createUserEvent = async (
  values: z.infer<typeof CreateUpdateEventSchema & google.maps.LatLngLiteral>,
): Promise<Response> => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!session?.user || !userId) {
      throw new CustomError('Forbidden');
    }

    const event = await createEvent(values, userId);
    if (!event) {
      throw new CustomError('Event creation failed');
    }

    return { message: 'Event created successfully', ok: true };
  } catch (error) {
    return handleServerError({ error });
  }
};
