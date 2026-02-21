import ReactMapGL, { Marker, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetAllUsersQuery } from '../../slices/usersSlice';
import { setDestination } from '../../slices/navSlice';
import ProviderMarker from './ProviderMarker';
import RouteDetails from './RouteDetails';
import useDirections from '../../hooks/useDirections';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const routeLayer = {
  id: 'route',
  type: 'line',
  paint: {
    'line-color': '#3b82f6',
    'line-width': 4,
  },
};

const Map = () => {
  const dispatch = useDispatch();
  const latitude = useSelector((state) => state.nav.origin.location.latitude);
  const longitude = useSelector((state) => state.nav.origin.location.longitude);

  const [viewState, setViewState] = useState({
    latitude,
    longitude,
    zoom: 12,
  });

  useEffect(() => {
    setViewState((prev) => ({ ...prev, latitude, longitude }));
  }, [latitude, longitude]);

  const destination = useSelector((state) => state.nav.destination);
  const travelTime = useSelector((state) => state.nav.travelTimeInformation);
  const { route, clearRoute } = useDirections(
    destination ? { lat: latitude, lng: longitude } : null,
    destination?.position || null
  );

  const { data: users, isLoading, isSuccess, isError } = useGetAllUsersQuery({ pageNumber: 1 });

  let locations;
  if (isLoading) return <p>Loading</p>;
  if (isError) return <p>Error</p>;
  if (isSuccess) {
    locations = users
      .filter((user) => user.location && user.role === 'provider')
      .map((provider) => ({
        id: provider._id,
        name: provider.name,
        position: {
          lat: provider.location.coordinates[1],  // GeoJSON: [lng, lat]
          lng: provider.location.coordinates[0],
        },
      }));
  }

  return (
    <div className='flex flex-col'>
      <div className={`${destination ? 'flex-[0_0_80%]' : 'h-full'}`}>
        <ReactMapGL
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle='mapbox://styles/mapbox/streets-v12'
          style={{ width: '100%', height: '100%' }}
        >
          <Marker latitude={latitude} longitude={longitude} color='#ef4444' />
          {locations?.map((provider) => (
            <ProviderMarker
              key={provider.id}
              position={provider.position}
              selectProvider={() => dispatch(setDestination(provider))}
            />
          ))}
          {route && (
            <Source id='route' type='geojson' data={route}>
              <Layer {...routeLayer} />
            </Source>
          )}
        </ReactMapGL>
      </div>
      {travelTime && (
        <div className='flex-[0_0_05%]'>
          <RouteDetails clearRoute={clearRoute} details={travelTime} />
        </div>
      )}
    </div>
  );
};

export default Map;
