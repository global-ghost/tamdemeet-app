import { omit } from '@utils/omit';
import { db } from 'lib/db';
import { emailSchema } from 'schemas';
import type { User, UserLocation, UserSession } from '@prisma/client';

type CreateUserPayload = { login?: string; email: string; password?: string };

export type UserDto = Omit<User, 'password'> & {
  sessionId?: string;
  UserSession?: UserSession;
};

export type UserMinimalDTO = { UserLocation?: UserLocation } & Pick<
  User,
  'name' | 'id' | 'email' | 'image'
>;

export const userDto = (user: User): UserDto => omit(user, ['password']);

export const userMinimalDto = (
  user: User & { UserLocation?: UserLocation | null },
): UserMinimalDTO => ({
  id: user.id,
  name: user.name,
  email: user.email,
  image: user.image,
  UserLocation: user.UserLocation ?? undefined,
});

export const createUser = async ({
  login,
  email,
  password,
}: CreateUserPayload) => {
  return await db.user.create({
    data: {
      login,
      email,
      password,
      isTwoFactorAvailable: true,
    },
  });
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({ where: { email } });

    return user;
  } catch {
    return null;
  }
};

export const getUserByLogin = async (login: string) => {
  try {
    const user = await db.user.findUnique({ where: { login } });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    return await db.user.findUnique({
      where: { id },
      include: { UserSession: true, UserLocation: true },
    });
  } catch {
    return null;
  }
};

export const getUserByIdentifier = async (identifier: string) => {
  if (emailSchema.safeParse(identifier).success) {
    return await getUserByEmail(identifier);
  } else {
    return await getUserByLogin(identifier);
  }
};

export const getUsersByIds = async (ids: string[]) => {
  if (!ids.length) {
    return null;
  }
  return await db.user.findMany({
    where: { id: { in: ids } },
    include: { UserLocation: true },
  });
};
