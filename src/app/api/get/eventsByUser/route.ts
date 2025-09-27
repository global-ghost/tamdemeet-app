import { NextResponse } from 'next/server';
import { CustomError } from 'actions/response';
import { auth } from 'auth';
import { getUserEvents } from 'data/events';
import { stringify } from 'superjson';

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!session?.user || !userId) {
    throw new CustomError('Forbidden', 403);
  }

  const events = await getUserEvents(userId);

  const response = {
    ok: true,
    data: events,
  };

  const serialized = stringify(response);

  return new NextResponse(serialized, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
