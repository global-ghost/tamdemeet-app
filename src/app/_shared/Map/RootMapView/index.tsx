import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@components/ui';
import { GoogleMap } from '@react-google-maps/api';
import { useGeolocationSync } from '@utils/useSyncedGeolocation';
import { useToggle } from '@utils/useToggle';
import { isSuccessResponse } from 'actions/response';
import { fetchEvents } from 'lib/api/fetchEvents';
import { fetchFriendRequests } from 'lib/api/fetchFriendRequests';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { defaultMapContainerStyle, mapOptions } from '../mapOptions';
import { createOrUpdateContactsMarkers } from './createOrUpdateContactsMarkers';
import { createOrUpdateEventsMarkers } from './createOrUpdateEventsMarkers';
import { createUserMarkerElement } from './createUserMarkerElement';
import { GeolocationLoader } from './GeolocationLoader';
import { RootMapSideBar } from './RootMapSideBar';

type Props = {
  handleChangeSelectedEventId: (eventId: string) => void;
  updateEventCoords: (coords: google.maps.LatLngLiteral) => void;
};

export const RootMap: React.FunctionComponent<Props> = ({
  updateEventCoords,
  handleChangeSelectedEventId,
}) => {
  const { permission, position, initialLoading } = useGeolocationSync();
  const [isMapReady, setIsMapReady] = useState(false);
  const { data: userSession } = useSession();

  const { data: eventsData } = useSWR('/user-events', fetchEvents);

  const { data: contactsData, mutate } = useSWR(
    '/friends-requests',
    fetchFriendRequests,
  );

  const {
    isOpen: isSidebarOpen,
    toggle: toggleSidebar,
    close: closeSidebar,
  } = useToggle();

  const events = useMemo(
    () =>
      isSuccessResponse(eventsData) && eventsData.data ? eventsData.data : [],
    [eventsData],
  );

  const contacts = useMemo(
    () =>
      isSuccessResponse(contactsData) ? contactsData.data.acceptedRequests : [],
    [contactsData],
  );

  const mapRef = useRef<google.maps.Map | null>(null);
  const contactsMarkersRef = useRef<
    Record<string, google.maps.marker.AdvancedMarkerElement>
  >({});

  const eventsMarkersRef = useRef<
    Record<string, google.maps.marker.AdvancedMarkerElement>
  >({});

  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null,
  );

  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  const handleShowCurentLocation = useCallback(() => {
    setCenter({ lat: position!.lat, lng: position!.lng });
  }, [position]);

  const updateOrCreateUserMarker = useCallback(() => {
    if (!mapRef.current || !position) {
      return;
    }

    if (userMarkerRef.current) {
      userMarkerRef.current.position = position;
    } else {
      const element = createUserMarkerElement(
        userSession?.user?.image ?? undefined,
      );
      userMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position,
        content: element,
        title: 'YOU',
      });
    }
  }, [position, userSession?.user?.image]);

  const handleEventClick = useCallback(
    (eventId: string) => {
      handleChangeSelectedEventId(eventId);
    },
    [handleChangeSelectedEventId],
  );

  useEffect(() => {
    if (position && !center) {
      setCenter(position);
    }
  }, [position, center]);

  useEffect(() => {
    closeSidebar();
  }, [center, closeSidebar]);

  useEffect(() => {
    const interval = setInterval(() => {
      mutate();
    }, 60000);

    return () => clearInterval(interval);
  }, [mutate]);

  useEffect(() => {
    if (isMapReady && mapRef.current) {
      updateOrCreateUserMarker();
    }
  }, [position, updateOrCreateUserMarker, isMapReady]);

  useEffect(() => {
    if (isMapReady && mapRef.current && contacts?.length) {
      createOrUpdateContactsMarkers(
        mapRef.current,
        contacts,
        contactsMarkersRef,
      );
    }
  }, [contacts, isMapReady]);

  useEffect(() => {
    if (isMapReady && mapRef.current && events?.length) {
      createOrUpdateEventsMarkers(
        mapRef.current,
        events,
        eventsMarkersRef,
        handleEventClick,
      );
    }
  }, [events, handleEventClick, isMapReady]);

  const memoizedMap = useMemo(
    () => (
      <GoogleMap
        zoom={14}
        options={mapOptions}
        center={center!}
        mapContainerStyle={defaultMapContainerStyle}
        onLoad={(map) => {
          if (map) {
            mapRef.current = map;
            setIsMapReady(true);
          }

          map.addListener('dblclick', (e: google.maps.MapMouseEvent) => {
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
          if (userMarkerRef.current) {
            userMarkerRef.current.map = null;
          }
        }}
      />
    ),
    [center, updateEventCoords],
  );

  if (permission === 'denied') {
    return <div>Geolocation not allowed...</div>;
  }

  if (!center && initialLoading) {
    return <GeolocationLoader />;
  }

  return (
    <div className='mt-[10px] flex size-full gap-[20px]'>
      <div className='relative size-full shrink-0 lg:w-2/3'>
        {/* TODO: search by places (Google API / Events / Friends) */}

        <div className='fixed right-[10px] top-[10px] z-50 rounded-full bg-card p-1 lg:hidden'>
          <Button
            icon={isSidebarOpen ? 'close' : 'menu'}
            iconSize={24}
            iconColor='lightWhite'
            onClick={toggleSidebar}
          />
        </div>

        <div
          className='absolute bottom-[20px] right-[10px] z-30 flex gap-[10px] rounded-full bg-card
            p-1'
        >
          <Button
            iconSize={30}
            iconColor='lightWhite'
            onClick={handleShowCurentLocation}
            icon='location'
          />
        </div>
        {center && memoizedMap}
      </div>
      <div
        className={`fixed right-0 top-0 z-40 size-full w-full transition-transform duration-300
        sm:max-w-[400px] lg:block lg:w-full lg:max-w-full ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:static lg:block lg:translate-x-0`}
      >
        <RootMapSideBar
          contacts={contacts}
          events={events}
          updateMapCenter={setCenter}
        />
      </div>
    </div>
  );
};
