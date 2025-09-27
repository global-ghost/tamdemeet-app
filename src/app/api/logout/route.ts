import { NextResponse } from 'next/server';
import { auth } from 'auth';
import { removeSession } from 'data/session';

export async function POST() {
  const session = await auth();

  if (session?.user?.sessionId && session?.user?.id) {
    await removeSession(session.user.sessionId, session.user.id);
  }

  const response = NextResponse.json({ success: true });

  return response;
}
