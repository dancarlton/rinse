import { AdvancedMarker, APIProvider, Map as GoogleMap, Pin } from '@vis.gl/react-google-maps';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';

const Map = () => {
  const latitude = useSelector((state) => state.nav.origin.location.latitude);
  const longitude = useSelector((state) => state.nav.origin.location.longitude);
  const center = useMemo(() => ({ lat: latitude, lng: longitude }), [latitude, longitude]);

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      {/* get a map id here: https://developers.google.com/maps/documentation/get-map-id#create-a-map-id */}
      <GoogleMap zoom={12} center={center} mapId={import.meta.env.VITE_MAP_ID}>
        {/* Marker for user's current map position */}
        <AdvancedMarker position={center}>
          <Pin />
        </AdvancedMarker>
      </GoogleMap>
    </APIProvider>
  );
};

export default Map;
