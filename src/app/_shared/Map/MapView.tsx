'use client';

import { useCallback, useState } from 'react';
import { EventDialog } from './EventDialog';
import { RootMap } from './RootMapView';

export const MapView = () => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [eventCoords, setEventCoords] =
    useState<google.maps.LatLngLiteral | null>(null);

  const handleChangeEventCoords: (
    coords: google.maps.LatLngLiteral | null,
  ) => void = useCallback((coords) => {
    setEventCoords(coords);
  }, []);

  const handleCloseEventDialog = useCallback(() => {
    setEventCoords(null);
    setSelectedEventId(null);
  }, []);

  const handleChangeSelectedEventId = useCallback((eventId: string) => {
    setSelectedEventId(eventId);
  }, []);

  return (
    <>
      <RootMap
        updateEventCoords={handleChangeEventCoords}
        handleChangeSelectedEventId={handleChangeSelectedEventId}
      />
      {(eventCoords || selectedEventId) && (
        <EventDialog
          eventId={selectedEventId}
          eventCoords={eventCoords}
          onClose={handleCloseEventDialog}
          updateEventCoords={handleChangeEventCoords}
        />
      )}
    </>
  );
};
