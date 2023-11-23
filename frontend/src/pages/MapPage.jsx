import React from 'react';
import { useLoadScript } from '@react-google-maps/api';

import Map from '../components/Map';
import ServiceSearchMap from '../components/ServiceSearchMap';
import ServiceList from '../components/ServiceList';
import { useSelector } from 'react-redux';

const MapPage = () => {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const libraries = ['places'];
  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
    libraries,
  });
  // checking latitude, if it is 0 then we will not show service list
  const latitude = useSelector((state) => state.nav.origin.location.latitude);

  return (
    <div className="flex flex-col-reverse justify-center lg:flex-row w-full">
      {/* Search for Services */}

      <div className="">
        <ServiceSearchMap />
      </div>

      {/* Render the Service List */}
      {latitude !== 0 && <ServiceList className="" />}

      {/* Render Map Component */}
      {isLoaded && (
        <div>
          <div className="grid grow h-[75vh] lg:w-[500px]">
            <Map />
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;
