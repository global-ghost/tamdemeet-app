'use server';

import { CustomError, handleServerError } from 'actions/response';
import { auth } from 'auth';
import { db } from 'db';
import type { Response } from 'actions/response';

export const terminateSessions = async (): Promise<Response> => {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new CustomError('Forbidden');
    }

    const sessionsIds = session.user.UserSession?.sessionsIds ?? [];
    const sessionId = session.user.sessionId!;
    const sessionsIdsToRemove = sessionsIds.filter(
      (session) => session !== sessionId,
    );

    await db.session.deleteMany({ where: { id: { in: sessionsIdsToRemove } } });
    await db.userSession.update({
      where: { userId: session.user.id },
      data: { sessionsIds: [sessionId] },
    });

    return {
      message: 'Terminated successfully',
      ok: true,
    };
  } catch (error) {
    return handleServerError({ error });
  }
};
