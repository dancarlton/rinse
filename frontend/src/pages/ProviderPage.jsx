import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Avatar from '../components/Avatar';

const ProviderPage = () => {
  const { name } = useParams();
  const [providerData, setProviderData] = useState(null);

  useEffect(() => {
    // we have a RTK Query for this. use that instead of fetching here
    const fetchData = async () => {
      try {
        // get all users
        const response = await fetch(`/api/users`);
        const data = await response.json();
        // Find the user with the specified name and role "provider"
        // TODO: Refactor this because this will find multiple users eventually
        const foundProvider = data.find((user) => user.name === name && user.role === 'provider');
        if (foundProvider) {
          setProviderData(foundProvider);
        } else {
          // TODO: handle case where provider is not found

          console.error(`Provider with name ${name} not found.`);
        }
      } catch (error) {
        // TODO: Handle error
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [name]);

  if (!providerData) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='loader'></div>
      </div>
    );
  }

  const overallRating = providerData.reviews?.length
    ? providerData.reviews.reduce((sum, review) => sum + review.rating, 0) /
      providerData.reviews.length
    : 0;

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h1 className='text-4xl font-bold text-center my-6'>{providerData.name}</h1>

      {/* Provider Information Section */}
      <section className='flex flex-col md:flex-row md:justify-between items-center my-8'>
        <Avatar
          source={providerData.avatar}
          name={providerData.name}
          className='w-24 h-24 rounded-full'
        />

        {/* Rating Subsection */}
        <div className='text-lg mt-4 md:mt-0'>
          <h3 className='font-semibold'>Rating:</h3>
          <div className='flex items-center mt-2'>
            {/* Rating Stars */}
            {Array.from({ length: Math.round(overallRating) }, (_, i) => (
              <svg key={i} fill='yellow' className='w-6 h-6 text-yellow-500' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M10 1L12.245 6.75H18.764L13.51 10.5l2.245 5.75L10 14.25 4.245 16.25l2.245-5.75L1.236 6.75h6.52L10 1z'
                />{' '}
              </svg>
            ))}
            {/* Numeric Rating */}
            <span className='ml-2 text-xl font-bold'>{overallRating.toFixed(1)}</span>
          </div>
        </div>

        {/* Location Subsection */}
        <div className='text-lg mt-4 md:mt-0'>
          <h3 className='font-semibold'>Location:</h3>
          <p className='font-bold mt-2'>{providerData.serviceArea}</p>
        </div>
      </section>

      {/* Services Section */}
      <section className='my-8'>
        <h3 className='text-2xl font-bold mb-4'>Services</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {/* Service Cards */}
          {/* TODO: Turn this into a component */}
          {providerData.services?.map((service, index) => (
            <div key={index} className='card card-compact bg-base-100 shadow-xl'>
              <figure className='h-48 overflow-hidden'>
                <img
                  src={service.photo}
                  alt={service.name}
                  className='object-cover w-full h-full'
                />
              </figure>
              <div className='card-body'>
                <h2 className='card-title'>
                  {service.name} - ${service.price}
                </h2>
                <p>{service.description}</p>
                <div className='card-actions justify-end mt-4'>
                  {/* TODO: Change this route to use provider ID not name, other stuff has to be changed as well to use provider id */}
                  <Link
                    to={`/provider/${providerData.name}/bookings`}
                    className='btn btn-secondary mr-2'
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* TODO: Change this to use RTK query to fetch reviews based on provider id and then provide pagination for the reviews */}
      {/* TODO: add filtering of reviews by # of stars or date */}
      {/* Reviews Section */}
      <section className='my-8'>
        <h3 className='text-2xl font-bold mb-4'>Reviews</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {/* Individual Review Cards */}
          {providerData.reviews?.map((review, index) => (
            <div key={index} className='card bg-base-100 shadow-xl p-4'>
              <div className='flex items-start space-x-4'>
                {/* TODO: Change default avatar */}
                <img
                  src={review.avatar || '/default-avatar.png'}
                  alt='Reviewer'
                  className='w-16 h-16 rounded-full'
                />
                <div>
                  <h4 className='font-semibold'>{review.user}</h4>
                  <div className='flex items-center mt-1'>
                    {/* Star Ratings */}
                    {Array.from({ length: 5 }, (_, i) => (
                      <svg
                        key={i}
                        fill={i < review.rating ? 'currentColor' : 'none'}
                        stroke='currentColor'
                        className='w-5 h-5 text-yellow-500'
                        viewBox='0 0 20 20'
                      >
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z' />
                      </svg>
                    ))}
                  </div>
                  <p className='mt-3 text-gray-600'>{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProviderPage;
