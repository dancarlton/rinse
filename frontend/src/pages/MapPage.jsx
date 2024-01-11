import React from 'react';
import { useLoadScript } from '@react-google-maps/api';

import Map from '../components/Map/index';
import ServiceSearchMap from '../components/ServiceSearchMap';
import ServiceList from '../components/ServiceList';
import { useSelector } from 'react-redux';
import { APIProvider } from '@vis.gl/react-google-maps';
const libraries = ['places'];

const MapPage = () => {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
    libraries,
  });
  // checking latitude, if it is 0 then we will not show service list
  const latitude = useSelector((state) => state.nav.origin.location.latitude);

  return (
    <div className='flex flex-col-reverse justify-between lg:flex-row w-full absolute px-10 py-3'>
      {/* Search for Services */}

      <div className=''>
        <ServiceSearchMap />
      </div>

      {/* Render the Service List */}
      {latitude !== 0 && <ServiceList className='' />}

      {/* Render Map Component */}
      {isLoaded && (
        <div>
          <div className='grid grow h-[650px] lg:w-[420px] left-[960px] rounded-md'>
            {/* <div className='grid top-[83px] left-[960px] w-[422px] h-[641px] rounded-md'> */}
            <APIProvider apiKey={googleMapsApiKey}>
              <Map />
            </APIProvider>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;
