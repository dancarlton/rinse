import { GoogleMap, MarkerF } from '@react-google-maps/api';
import { useMemo } from 'react';
import '../assets/styling/Root.css';
import { useSelector } from 'react-redux';
import { mapStyle } from '../assets/styling/mapStyling';

// Combination of https://github.com/JustFly1984/react-google-maps-api/tree/master/packages/react-google-maps-api
// and https://tomchentw.github.io/react-google-maps/
// When user selects new autocomplete location, center variable gets re calculated and the map will recenter to that location
const Map = () => {
  const latitude = useSelector((state) => state.nav.origin.location.latitude);
  const longitude = useSelector((state) => state.nav.origin.location.longitude);
  const center = useMemo(() => ({ lat: latitude, lng: longitude }), [latitude, longitude]);

  return (
    <>
      <GoogleMap
        // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions
        options={{
          styles: mapStyle,
          disableDefaultUI: true,
          zoomControl: true,
          fullscreenControl: true,
        }}
        mapContainerClassName='rounded'
        center={center}
        zoom={12}
      >
        <MarkerF
          position={center}
          icon={{
            url: '/images/icons/google-pin.png',
            scaledSize: new window.google.maps.Size(35, 35),
          }}
        ></MarkerF>
      </GoogleMap>
    </>
  );
};

export default Map;
