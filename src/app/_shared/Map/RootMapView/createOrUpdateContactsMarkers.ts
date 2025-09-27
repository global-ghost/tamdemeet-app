import { createUserMarkerElement } from './createUserMarkerElement';
import type { FriendRequestWithUser } from 'src/app/api/get/freindRequests/route';

export const createOrUpdateContactsMarkers = (
  map: google.maps.Map,
  contacts: FriendRequestWithUser[],
  markerRefs: React.MutableRefObject<
    Record<string, google.maps.marker.AdvancedMarkerElement>
  >,
) => {
  contacts.forEach((contact) => {
    if (contact.UserLocation) {
      if (markerRefs.current[contact.id]) {
        markerRefs.current[contact.id].position = {
          lat: contact.UserLocation.lat,
          lng: contact.UserLocation.lng,
        };
      } else {
        const element = createUserMarkerElement(
          contact.image ?? undefined,
          contact.name ?? undefined,
        );

        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: {
            lat: contact.UserLocation?.lat,
            lng: contact.UserLocation?.lng,
          },
          content: element,
        });
        markerRefs.current[contact.id] = marker;
      }
    }
  });
};
