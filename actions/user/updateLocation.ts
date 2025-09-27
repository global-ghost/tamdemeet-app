'use server';

import { CustomError, handleServerError } from 'actions/response';
import { auth } from 'auth';
import { createUserLocation, updateUserLocation } from 'data/location';
import { db } from 'db';
import type { Response } from 'actions/response';

export const updateLocation = async (
  lat: number,
  lng: number,
): Promise<Response> => {
  try {
    const session = await auth();

    const userId = session?.user?.id;

    if (!session?.user || !userId) {
      throw new CustomError('Forbidden');
    }

    const userLocation = await db.userLocation.findUnique({
      where: {
        userId,
      },
    });

    if (!userLocation) {
      await createUserLocation(userId, lat, lng);
    } else {
      await updateUserLocation(userId, lat, lng);
    }

    return { message: 'Updated successfully', ok: true };
  } catch (error) {
    return handleServerError(error);
  }
};
