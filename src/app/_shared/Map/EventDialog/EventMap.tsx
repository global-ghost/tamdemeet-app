import { memo, useRef, useEffect, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { defaultMapContainerStyle, mapOptions } from '../mapOptions';
import { createEventDialogMarkerElement } from './createEventDialogMarkerElement';

export type EventMapProps = {
  eventCoords: google.maps.LatLngLiteral | null;
  updateEventCoords: (coords: google.maps.LatLngLiteral | null) => void;
};

export const Map: React.FunctionComponent<EventMapProps> = ({
  eventCoords,
  updateEventCoords,
}) => {
  const [isMapReady, setIsMapReady] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null,
  );

  useEffect(() => {
    if (isMapReady) {
      const element = createEventDialogMarkerElement();

      if (markerRef.current) {
        markerRef.current.position = eventCoords;
        markerRef.current.content = element;
      } else {
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map: mapRef.current,
          position: eventCoords,
          content: element,
        });
        markerRef.current = marker;
      }
    }
  }, [eventCoords, isMapReady]);

  return (
    <GoogleMap
      onLoad={(map) => {
        mapRef.current = map;
        if (map) {
          mapRef.current = map;
          setIsMapReady(true);
        }

        map.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            const coords = {
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            };
            updateEventCoords(coords);
          }
        });
      }}
      onUnmount={() => {
        mapRef.current = null;
        if (markerRef.current) {
          markerRef.current.map = null;
        }
      }}
      zoom={18}
      options={mapOptions}
      center={eventCoords!}
      mapContainerStyle={defaultMapContainerStyle}
    />
  );
};

export const EventMap = memo(Map);
