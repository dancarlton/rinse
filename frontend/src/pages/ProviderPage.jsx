import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Avatar from '../components/Avatar';
import { useGetOneUserQuery, useGetUserServicesQuery, useGetUserReviewsQuery } from '../slices/usersSlice';

const ProviderPage = () => {
  const { id } = useParams();
  const { data: providerData, isLoading: isLoadingProvider, isError: isProviderError } = useGetOneUserQuery(id);
  const { data: services, isLoading: isLoadingServices } = useGetUserServicesQuery(id);
  const { data: reviews, isLoading: isLoadingReviews } = useGetUserReviewsQuery(id);

  if (isLoadingProvider) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='loader'></div>
      </div>
    );
  }

  if (isProviderError || !providerData) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p>Provider not found.</p>
      </div>
    );
  }

  const overallRating = providerData.rating || 0;

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
          <p className='font-bold mt-2'>{providerData.location ? 'Available' : 'Not set'}</p>
        </div>
      </section>

      {/* Services Section */}
      <section className='my-8'>
        <h3 className='text-2xl font-bold mb-4'>Services</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {isLoadingServices ? (
            <p>Loading services...</p>
          ) : services && services.length > 0 ? (
            services.map((service) => (
              <div key={service._id} className='card card-compact bg-base-100 shadow-xl'>
                <figure className='h-48 overflow-hidden'>
                  <img
                    src={service.photo || '/images/icons/service-missing.png'}
                    alt={service.title}
                    className='object-cover w-full h-full'
                  />
                </figure>
                <div className='card-body'>
                  <h2 className='card-title'>
                    {service.title} - ${service.price}
                  </h2>
                  <p>{service.description}</p>
                  <p className='text-sm text-gray-500'>Est. {service.estimatedTime} min</p>
                  <div className='card-actions justify-end mt-4'>
                    <Link
                      to={`/provider/${id}/bookings`}
                      className='btn btn-secondary mr-2'
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No services listed yet.</p>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className='my-8'>
        <h3 className='text-2xl font-bold mb-4'>Reviews</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {isLoadingReviews ? (
            <p>Loading reviews...</p>
          ) : reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className='card bg-base-100 shadow-xl p-4'>
                <div className='flex items-start space-x-4'>
                  <img
                    src='/default-avatar.png'
                    alt='Reviewer'
                    className='w-16 h-16 rounded-full'
                  />
                  <div>
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
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProviderPage;
