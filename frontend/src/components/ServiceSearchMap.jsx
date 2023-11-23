import React from 'react';
import AutoComplete from './AutoComplete';
import { useLoadScript } from '@react-google-maps/api';

const ServiceSearchMap = () => {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const libraries = ['places'];
  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
    libraries,
  });

  return (
    // <div className='bg-white box-border flex flex-col h-848 min-h-auto order-1 overflow-x-auto overflow-y-auto pl-4 pr-4 static scroll-snap-align-none top-0 w-400 z-auto'>
    //   <h2 className='text-3xl font-bold'>Get Rinsed</h2>
    //   <AutoComplete />
    // </div>
    <div className="hero bg-base-300">
      <div className="flex justify-center gap-4 flex-col lg:flex-row-reverse w-full xl:items-center ">
        {isLoaded && (
          <div className="card w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body max-w-screen">
              <div className="form-control">
                <label className="label">
                  <span className="text-2xl font-bold">Get Rinsed</span>
                </label>
                <AutoComplete />
              </div>
              {/* <div className='form-control'>
              <AutoComplete />
            </div>
            <div className='form-control'>
              <AutoComplete />
            </div> */}
              <div className="form-control mt-6">
                <button className="btn btn-primary">schedule now</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceSearchMap;
