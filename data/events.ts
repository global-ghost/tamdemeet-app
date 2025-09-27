import { db } from 'db';
import type { Event } from '@prisma/client';
import type { CreateUpdateEventSchema } from 'schemas';
import type * as z from 'zod';

export const createEvent = async (
  data: z.infer<typeof CreateUpdateEventSchema>,
  ownerId: string,
) => {
  try {
    return await db.event.create({ data: { ...data, ownerId } });
  } catch (error) {
    return null;
  }
};

export const updateEvent = async (eventId: string, data: Partial<Event>) => {
  try {
    return await db.event.update({ data, where: { id: eventId } });
  } catch {
    return null;
  }
};

export const getUserEvents = async (userId: string) => {
  try {
    const userEvents = await db.event.findMany({
      where: {
        OR: [{ ownerId: userId }, { invitedUserIds: { has: userId } }],
      },
    });

    return userEvents || [];
  } catch {
    return null;
  }
};
