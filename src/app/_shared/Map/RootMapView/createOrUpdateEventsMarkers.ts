import { createEventMarkerElement } from './createEventMarkerElement';

export const createOrUpdateEventsMarkers = (
  map: google.maps.Map,
  events: { id: string; lat: number; lng: number; title: string }[],
  markerRefs: React.MutableRefObject<
    Record<string, google.maps.marker.AdvancedMarkerElement>
  >,
  onEventClick: (event: string) => void,
) => {
  events.forEach((event) => {
    if (markerRefs.current[event.id]) {
      const marker = markerRefs.current[event.id];
      markerRefs.current[event.id].position = {
        lat: event.lat,
        lng: event.lng,
      };

      marker.position = {
        lat: event.lat,
        lng: event.lng,
      };

      marker.content = createEventMarkerElement(event.title);
    } else {
      const element = createEventMarkerElement(event.title);

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: {
          lat: event.lat,
          lng: event.lng,
        },
        content: element,
      });

      marker.addListener('gmp-click', () => {
        onEventClick(event.id);
      });

      markerRefs.current[event.id] = marker;
    }
  });
};
