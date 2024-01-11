import { AdvancedMarker, Map as GoogleMap, Pin } from '@vis.gl/react-google-maps';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetAllUsersQuery } from '../../slices/usersSlice';
import { setDestination } from '../../slices/navSlice';
import ProviderMarker from './ProviderMarker';
import Routes from './Routes';
import RouteDetails from './RouteDetails';
import useDirections from '../../hooks/useDirections';

const Map = () => {
  const dispatch = useDispatch();
  // Curent user position
  const latitude = useSelector((state) => state.nav.origin.location.latitude);
  const longitude = useSelector((state) => state.nav.origin.location.longitude);
  const center = useMemo(() => ({ lat: latitude, lng: longitude }), [latitude, longitude]);

  const destination = useSelector((state) => state.nav.destination);
  const travelTime = useSelector((state) => state.nav.travelTimeInformation);
  // Instances passed as props to render in Routes and clear routes RouteDetails
  const { directionsService, directionsRenderer, map } = useDirections();

  const { data: users, isLoading, isSuccess, isError } = useGetAllUsersQuery({ pageNumber: 1 });

  let locations;
  if (isLoading) {
    return <p>Loading</p>;
  } else if (isError) {
    return <p>Error</p>;
  } else if (isSuccess) {
    locations = users
      .filter((user) => user.locations && user.role === 'provider')
      .map((provider) => ({
        id: provider._id,
        position: {
          lat: Number(provider.locations.latitude),
          lng: Number(provider.locations.longitude),
        },
      }));
  }
  return (
    <div className='flex flex-col'>
      <div className={`${destination ? 'flex-[0_0_80%]' : 'h-full'}`}>
        {/* get a map id here: https://developers.google.com/maps/documentation/get-map-id#create-a-map-id */}
        <GoogleMap zoom={12} center={center} mapId={import.meta.env.VITE_MAP_ID}>
          {/* Marker for user's current map position */}
          <AdvancedMarker position={center}>
            <Pin />
          </AdvancedMarker>
          {locations !== undefined &&
            locations.map((provider) => (
              <ProviderMarker
                key={provider.id}
                position={provider.position}
                selectProvider={() => dispatch(setDestination(provider))}
              />
            ))}
          {/* Route rendering component */}
          {destination && (
            <Routes
              origin={center}
              destination={destination.position}
              directionsService={directionsService}
              directionsRenderer={directionsRenderer}
              map={map}
            />
          )}
        </GoogleMap>
      </div>
      {travelTime && (
        <div className='flex-[0_0_05%]'>
          <RouteDetails directionsRenderer={directionsRenderer} details={travelTime} />
        </div>
      )}
    </div>
  );
};

export default Map;
