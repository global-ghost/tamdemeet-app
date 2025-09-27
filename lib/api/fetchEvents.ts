import { parse } from 'superjson';
import type { Event } from '@prisma/client';

type SuccessResponse = {
  ok: true;
  data: Event[];
};

type ErrorResponse = {
  ok: false;
  error: string;
};

export type EventsResponse = SuccessResponse | ErrorResponse;

export const fetchEvents = async (): Promise<EventsResponse> => {
  const res = await fetch('/api/get/eventsByUser', {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    return { ok: false, error: errorBody?.error || 'Failed to fetch events' };
  }

  const raw = await res.text();
  const parsed = parse<EventsResponse>(raw);

  return parsed;
};
