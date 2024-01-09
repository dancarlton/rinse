import { AdvancedMarker, APIProvider, Map as GoogleMap, Pin } from '@vis.gl/react-google-maps';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetAllUsersQuery } from '../../slices/usersSlice';
import { setDestination } from '../../slices/navSlice';
import ProviderMarker from './ProviderMarker';
import ProviderDetails from './ProviderDetails';
import Routes from './Routes';

const Map = () => {
  const dispatch = useDispatch();
  // Cuurent user position
  const latitude = useSelector((state) => state.nav.origin.location.latitude);
  const longitude = useSelector((state) => state.nav.origin.location.longitude);
  const center = useMemo(() => ({ lat: latitude, lng: longitude }), [latitude, longitude]);

  const destination = useSelector((state) => state.nav.destination);

  const { data: users, isLoading, isSuccess, isError } = useGetAllUsersQuery({ pageNumber: 1 });

  let locations;
  if (isLoading) {
    return <p>Loading</p>;
  } else if (isError) {
    return <p>Error</p>;
  } else if (isSuccess) {
    locations = users
      .filter((user) => user.locations && user.role === 'provider')
      .map((provider) => {
        const obj = {
          id: provider._id,
          position: {
            lat: Number(provider.locations.latitude),
            lng: Number(provider.locations.longitude),
          },
        };
        return obj;
      });
  }
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div className='flex flex-col'>
        <div className={`${destination ? 'flex-[0_0_90%]' : 'h-full'}`}>
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
            {destination && <Routes origin={center} destination={destination.position} />}
          </GoogleMap>
        </div>
        {destination && (
          <div className='flex-[0_0_10%]'>
            <ProviderDetails position={destination.position} />
          </div>
        )}
      </div>
    </APIProvider>
  );
};

export default Map;
