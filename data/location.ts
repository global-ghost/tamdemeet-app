import { db } from 'db';
import type { User } from '@prisma/client';

export const createUserLocation = async (
  userId: User['id'],
  lat: number,
  lng: number,
) => {
  try {
    await db.userLocation.create({
      data: {
        userId: userId,
        lat,
        lng,
      },
    });
  } catch {
    return null;
  }
};

export const updateUserLocation = async (
  userId: User['id'],
  lat: number,
  lng: number,
) => {
  await db.userLocation.update({
    where: { userId },
    data: {
      lat,
      lng,
    },
  });
};

export const getUserLocationsByIds = async (ids: Array<string>) => {
  try {
    const locations = await db.userLocation.findMany({
      where: {
        userId: {
          in: ids,
        },
      },
    });

    return locations;
  } catch {
    return null;
  }
};
