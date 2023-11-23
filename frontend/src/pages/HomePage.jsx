import React from 'react';
import ServiceSearch from '../components/ServiceSearch';
import coverPhoto from '../assets/images/rinse-cover.jpeg';

const HomePage = () => (
  <div className="flex flex-col lg:flex-row w-full px-2 lg:p-8">
    {/* Search For Services */}
    <div className="lg:order-1 lg:items-center grow">
      <ServiceSearch />
    </div>

    {/* Hero Components */}
    <div className="lg:order-2">
      <img
        src={coverPhoto}
        alt="Cover"
        className="object-cover max-h-screen w-11/12 rounded-md overflow-hidden m-4"
      />
    </div>
  </div>
);

export default HomePage;
