import React from 'react';
import AutoComplete from '../components/AutoComplete';
import { useLoadScript } from '@react-google-maps/api';
import { Link } from 'react-router-dom';

const ServiceSearch = () => {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const libraries = ['places'];
  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
    libraries,
  });
  return (
    <div className="flex justify-center items-center min-h-max lg:flex-col lg:w-auto overflow-ellipsis">
      {isLoaded && (
        <div className="max-lg:w-screen p-5 space-y-8 ">
          <h1 className="text-left text-4xl lg:text-5xl font-bold lg:mb-1">
            Elevate Your Drive
            <p className="text-left max-sm:text-xl text-3xl">with On-Demand Car Washes</p>
          </h1>
          <p className="max-sm:text-sm max-sm: lg:text-sm font-bold">
            Select a service, sit back, and let the car wash come to you.
          </p>
          <div className="flex flex-col gap-4">
            <AutoComplete className="input input-bordered input-primary w-full" />

            <Link to="/map">
              <button className="btn btn-md md:btn-md lg:btn-lg mt-2">See Prices</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceSearch;
