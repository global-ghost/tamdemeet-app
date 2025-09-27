'use server';

import { auth } from 'auth';
import { updateEvent } from 'data/events';
import { db } from 'db';
import { CustomError, handleServerError, type Response } from '../response';
import type { CreateUpdateEventSchema } from 'schemas';

export const updateUserEvent = async (
  id: string,
  data: Partial<typeof CreateUpdateEventSchema>,
): Promise<Response> => {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new CustomError('Forbidden');
    }

    const userId = session.user.id;

    const userEvent = await db.event.findUnique({
      where: { id },
    });

    if (!userEvent) {
      throw new CustomError('Event not found');
    }

    if (userEvent.ownerId !== userId) {
      throw new CustomError('Forbidden');
    }

    const updatedEvent = await updateEvent(id, data);
    if (!updatedEvent) {
      throw new CustomError('Failed to update event');
    }

    return {
      ok: true,
      message: 'Updated successfully',
    };
  } catch (error) {
    return handleServerError({ error });
  }
};
