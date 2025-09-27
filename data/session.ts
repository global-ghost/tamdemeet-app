import { db } from 'lib/db';
import type { Session, User } from '@prisma/client';

export const createUserSession = async (userId: User['id']) => {
  try {
    await db.userSession.create({
      data: {
        userId: userId,
        sessionsIds: [],
      },
    });
  } catch {
    return null;
  }
};

export const createSession = async () => {
  try {
    return await db.session.create({ data: {} });
  } catch {
    return null;
  }
};

export const removeSession = async (id: Session['id'], userId: User['id']) => {
  try {
    const userSession = await db.userSession.findUnique({ where: { userId } });
    const updatedUserSession = userSession?.sessionsIds.filter(
      (sessionId) => sessionId !== id,
    );
    await db.userSession.update({
      where: { userId },
      data: { sessionsIds: { set: updatedUserSession } },
    });

    await db.session.delete({ where: { id } });
  } catch {
    return null;
  }
};
