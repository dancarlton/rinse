import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTravelTimeInformation } from '../slices/navSlice';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const useDirections = (origin, destination) => {
  const dispatch = useDispatch();
  const [route, setRoute] = useState(null);

  useEffect(() => {
    if (!origin || !destination) {
      setRoute(null);
      return;
    }

    const fetchDirections = async () => {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.routes?.length > 0) {
          const r = data.routes[0];
          setRoute({
            type: 'Feature',
            geometry: r.geometry,
          });

          const distanceKm = (r.distance / 1000).toFixed(1);
          const durationMin = Math.round(r.duration / 60);

          dispatch(
            setTravelTimeInformation({
              summary: r.legs[0]?.summary || 'Route',
              startAddress: `${origin.lat.toFixed(4)}, ${origin.lng.toFixed(4)}`,
              endAddress: `${destination.lat.toFixed(4)}, ${destination.lng.toFixed(4)}`,
              distance: `${distanceKm} km`,
              duration: `${durationMin} mins`,
            })
          );
        }
      } catch (err) {
        console.error('Directions fetch failed:', err);
      }
    };

    fetchDirections();
  }, [origin?.lat, origin?.lng, destination?.lat, destination?.lng, dispatch]);

  const clearRoute = () => {
    setRoute(null);
    dispatch(setTravelTimeInformation(null));
  };

  return { route, clearRoute };
};

export default useDirections;
