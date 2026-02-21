import React from 'react';
import Card from './Card';
import '../index.css';
import { useGetAllUsersQuery } from '../slices/usersSlice';
import { SERVICES_URL } from '../constants';
import { apiSlice } from '../slices/apiSlice';

// Inject a getAllServices endpoint inline
const servicesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllServices: builder.query({
      query: () => ({
        url: SERVICES_URL,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

const { useGetAllServicesQuery } = servicesApi;

const ServiceList = () => {
  const { data: services, isLoading: isLoadingServices, isError: isServicesError } = useGetAllServicesQuery();
  const { data: users } = useGetAllUsersQuery({ pageNumber: 1 });

  // Build a map of user IDs to user names for display
  const userMap = {};
  if (users) {
    users.forEach((user) => {
      userMap[user._id] = user.name || 'Provider';
    });
  }

  if (isLoadingServices) {
    return (
      <div className='services-list w-full'>
        <div className='h-screen w-full carousel carousel-vertical rounded-box overflow-y-auto px-4'>
          <h1 className='text-lg text-center lg:text-3xl lg:text-left font-bold pb-4'>Choose a Wash</h1>
          <p>Loading services...</p>
        </div>
      </div>
    );
  }

  if (isServicesError || !services) {
    return (
      <div className='services-list w-full'>
        <div className='h-screen w-full carousel carousel-vertical rounded-box overflow-y-auto px-4'>
          <h1 className='text-lg text-center lg:text-3xl lg:text-left font-bold pb-4'>Choose a Wash</h1>
          <p>No services available.</p>
        </div>
      </div>
    );
  }

  // Sort services into categories
  const sortedByPrice = [...services].sort((a, b) => a.price - b.price);
  const sortedByTime = [...services].sort((a, b) => a.estimatedTime - b.estimatedTime);
  const recommended = services.slice(0, 3);
  const bestDeals = sortedByPrice.slice(0, 3);
  const quickest = sortedByTime.slice(0, 3);

  const renderCards = (serviceList) =>
    serviceList.map((service) => (
      <Card
        key={service._id}
        service={service}
        providerName={userMap[service.provider] || 'Provider'}
        providerId={service.provider}
      />
    ));

  return (
    <div className='services-list w-full'>
      <div className='h-screen w-full carousel carousel-vertical rounded-box overflow-y-auto px-4'>
        <h1 className='text-lg text-center lg:text-3xl lg:text-left font-bold pb-4'>Choose a Wash</h1>

        {/* Recommended */}
        <h2 className='text-xl font-bold'>Recommended</h2>
        <div className='rounded-md flex-row py-1'>
          {renderCards(recommended)}
        </div>

        {/* Best Deals */}
        <h2 className='text-xl font-bold'>Best Deals</h2>
        <div className='rounded-md flex-row'>
          {renderCards(bestDeals)}
        </div>

        {/* Quickest Service */}
        <h2 className='text-xl font-bold'>Quickest Service</h2>
        <div className='rounded-md flex-row'>
          {renderCards(quickest)}
        </div>
      </div>
    </div>
  );
};

export default ServiceList;
