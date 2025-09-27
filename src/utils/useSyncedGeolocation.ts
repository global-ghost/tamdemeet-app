'use client';

import { useEffect, useRef, useState } from 'react';
import { getDistanceInMeters } from '@utils/getDistanceInMeters';
import { updateLocation } from 'actions/user/updateLocation';

type Position = { lat: number; lng: number };
type PermissionState = 'granted' | 'prompt' | 'denied';

export function useGeolocationSync() {
  const [position, setPosition] = useState<Position | null>(null);
  const [permission, setPermission] = useState<PermissionState>('prompt');
  const [initialLoading, setInitialLoading] = useState(true);

  const lastPositionRef = useRef<GeolocationPosition | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const firstUpdateDone = useRef(false);

  useEffect(() => {
    const minLoadingTime = 5000;
    const loadingTimer = setTimeout(() => {
      if (firstUpdateDone.current) {
        setInitialLoading(false);
      }
    }, minLoadingTime);

    const handleSuccess = async (pos: GeolocationPosition) => {
      const { latitude, longitude } = pos.coords;
      const newPos = { lat: latitude, lng: longitude };

      if (pos.coords.accuracy > 1000) {
        console.warn('Low accuracy, ignoring position');
        return;
      }

      const distance = lastPositionRef.current
        ? getDistanceInMeters(lastPositionRef.current, pos)
        : Infinity;

      if (distance > 20) {
        lastPositionRef.current = pos;
        setPosition(newPos);
        try {
          await updateLocation(latitude, longitude);
        } catch (err) {
          console.error('Failed to update location:', err);
        }
      }

      if (!firstUpdateDone.current) {
        firstUpdateDone.current = true;
        const elapsed = performance.now() - startTimeRef.current;
        if (elapsed >= minLoadingTime) {
          setInitialLoading(false);
        }
      }
    };

    const handleError = (error: GeolocationPositionError) => {
      console.error('Geolocation error:', error);
      if (error.code === error.PERMISSION_DENIED) {
        setPermission('denied');
      }
    };

    const startTimeRef = { current: performance.now() };

    if ('permissions' in navigator && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((status) => {
          setPermission(status.state as PermissionState);
          status.onchange = () => {
            setPermission(status.state as PermissionState);
          };
        })
        .catch((err) => {
          console.warn('Permissions API check failed:', err);
        });
    }

    if ('geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 30000,
        },
      );
    }

    return () => {
      clearTimeout(loadingTimer);
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return { position, permission, initialLoading };
}
