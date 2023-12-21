import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Avatar from '../components/Avatar';

const ProviderPage = () => {
  const { name } = useParams();
  const [providerData, setProviderData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/users`);
        const data = await response.json();

        // Find the user with the specified name and role "provider"
        const foundProvider = data.find((user) => user.name === name && user.role === 'provider');

        if (foundProvider) {
          setProviderData(foundProvider);
        } else {
          console.error(`Provider with name ${name} not found in the response.`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [name]);

  if (!providerData) {
    return <span className='loading loading-spinner loading-lg'></span>;
  }

  // Calculate overallRating if reviews are available
  const overallRating =
    providerData.reviews?.length > 0
      ? providerData.reviews.reduce((sum, review) => sum + review.rating, 0) /
        providerData.reviews.length
      : 0;

  // Render the rest of your component with the providerData
  return (
    <div className='ml-4'>
      <h1 className='font-bold text-3xl'>{providerData.name}</h1>

      {/* Avatar and Overall Rating Section */}
      <section className='flex flex-row gap-8 items-center'>
        {/* Avatar */}
        <Avatar source={providerData.avatar} name={providerData.name} />

        {/* Overall Rating Section */}
        <div>
          <h3 className='text-lg font-semibold mb-2'>Rating:</h3>
          <div className='flex items-center'>
            {/* Display the overall average rating using stars or any other symbol/icon */}
            {Array.from({ length: Math.round(overallRating) }, (_, i) => (
              <svg key={i} fill='yellow' viewBox='0 0 20 20' className='w-5 h-5 mr-1'>
                {/* Your star SVG or icon */}
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M10 1L12.245 6.75H18.764L13.51 10.5l2.245 5.75L10 14.25 4.245 16.25l2.245-5.75L1.236 6.75h6.52L10 1z'
                />
              </svg>
            ))}
            {/* Display the overall average rating as a number */}
            <span className='text-lg font-bold'>{overallRating.toFixed(1)}</span>
          </div>
        </div>

        {/* Service Area Section */}
        <div className=''>
          <h3 className='text-lg font-semibold mb-2'>Location:</h3>
          <p className='font-bold text-xl'>{providerData.serviceArea}</p>
        </div>
      </section>

      {/* Services Section */}
      <section>
        <h3 className='font-bold text-2xl mt-6'>Services</h3>
        <div>
          <ul className='space-x-4 flex flex-row'>
            {providerData.services &&
              providerData.services.map((service, index) => (
                <li key={index} className='flex items-center'>
                  <div className='card card-compact w-80 bg-base-100 shadow-xl'>
                    <figure>
                      <img
                        src={service.photo}
                        alt={service.name}
                        className='w-96 h-[192px] object-cover rounded'
                      />
                    </figure>
                    <div className='card-body bg-white'>
                      <h2 className='card-title'>
                        {service.name} - ${service.price}
                      </h2>
                      <p>{service.description}</p>
                      <div className='card-actions justify-end'>
                        <button className='btn btn-primary'>Book Now</button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </section>

      {/* Reviews Section */}
      <section>
        <h3 className='text-2xl font-bold mt-6'>Reviews</h3>
        <div className='box-content space-y-6 space-x-6 flex flex-rowp-4'>
          {providerData.services &&
            providerData.reviews.map((review, index) => (
              <div key={index} className='bg-white p-6 rounded-lg shadow-md'>
                <div className='flex items-center mb-4'>
                  <div className='flex-shrink-0'>
                    {/* Assuming you have user avatars */}
                    <img
                      src={review.avatar || '/images/icons/avatar-missing.jpg'}
                      alt={review.user}
                      className='w-10 h-10 rounded-full'
                    />
                  </div>
                  <div className='ml-4'>
                    <h4 className='text-lg font-semibold'>{review.user}</h4>
                    {/* Assuming you have a 5-star rating system */}
                    <div className='flex items-center'>
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg
                          key={i}
                          fill={i < review.rating ? 'yellow' : 'gray'}
                          viewBox='0 0 20 20'
                          className='w-5 h-5'
                        >
                          {/* Your star SVG or icon */}
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M10 1L12.245 6.75H18.764L13.51 10.5l2.245 5.75L10 14.25 4.245 16.25l2.245-5.75L1.236 6.75h6.52L10 1z'
                          />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className='text-gray-700'>{review.comment}</p>
              </div>
            ))}
        </div>
      </section>

      {/* Booking Calendar Section */}
      <section>
        <h3 className='font-bold text-2xl mt-6'>Booking Calendar</h3>
        <div className='bg-white border-black border'>
          <div className='text-black font-bold text-lg mb-4'>November 2023</div>
          <div className='days grid grid-cols-7 gap-1 text-black'>
            <div className='day'>Sun</div>
            <div className='day'>Mon</div>
            <div className='day'>Tue</div>
            <div className='day'>Wed</div>
            <div className='day'>Thu</div>
            <div className='day'>Fri</div>
            <div className='day'>Sat</div>

            {/* Days of the month */}
            {/* You can generate these dynamically based on the actual month and year */}
            <div className='day'></div>
            <div className='day'></div>
            {/* ... more days ... */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProviderPage;
