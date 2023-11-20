import React, { useState, useEffect } from 'react'
import sampleRinsers from '../data/sampleRinsers'
import { useParams } from 'react-router-dom'

const ProviderPage = () => {
  const { name } = useParams()
  const [providerData, setProviderData] = useState(null)

  useEffect(() => {
    // Simulating an asynchronous data fetch
    setTimeout(() => {
      // Find the provider in dummy data based on the name from the URL
      const foundProvider = sampleRinsers.find(
        provider => provider.name === name
      )

      if (foundProvider) {
        setProviderData(foundProvider)
      } else {
        console.error(`Provider with name ${name} not found in dummy data.`)
      }
    }, 1000) // Simulating a delay for demonstration purposes
  }, [name])

  if (!providerData) {
    return <div>Loading...</div>
  }

  // Calculate overallRating if reviews are available
  const overallRating =
    providerData.reviews?.length > 0
      ? providerData.reviews.reduce((sum, review) => sum + review.rating, 0) /
        providerData.reviews.length
      : 0

  // Render the rest of your component with the providerData
  return (
    <div className='ml-4'>
      <h1 className='font-bold text-3xl'>{providerData.name}</h1>

      {/* Avatar and Overall Rating Section */}
      <section className='flex flex-row gap-8 items-center'>
        {/* Avatar */}
        <div className='avatar online'>
          <div className='w-24 h-24 rounded-full overflow-hidden'>
            <img
              src={providerData.avatar || '/images/icons/avatar-missing.jpg'}
              alt={`${providerData.name}'s Avatar`}
              className='object-cover w-full h-full'
            />
          </div>
        </div>

        {/* Overall Rating Section */}
        <div>
          <h3 className='text-xl font-semibold mb-2'>Overall Rating</h3>
          <div className='flex items-center'>
            {/* Display the overall average rating using stars or any other symbol/icon */}
            {Array.from({ length: Math.round(overallRating) }, (_, i) => (
              <svg
                key={i}
                fill='yellow'
                viewBox='0 0 20 20'
                className='w-5 h-5 mr-1'>
                {/* Your star SVG or icon */}
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M10 1L12.245 6.75H18.764L13.51 10.5l2.245 5.75L10 14.25 4.245 16.25l2.245-5.75L1.236 6.75h6.52L10 1z'
                />
              </svg>
            ))}
            {/* Display the overall average rating as a number */}
            <span className='text-lg font-bold'>
              {overallRating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Service Area Section */}
        <div className='mt-4'>
          <h3 className='text-lg font-semibold mb-2'>Location:</h3>
          <p className='font-bold text-xl'>{providerData.serviceArea}</p>
        </div>
      </section>

      {/* Services Section */}
      <section>
        <h3 className='font-bold text-2xl mt-6'>Services</h3>
        <div>
          <ul className='space-x-4 flex flex-row'>
            {providerData.services.map((service, index) => (
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
          {providerData.reviews.map((review, index) => (
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
                        className='w-5 h-5'>
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
        {/* Include your booking calendar component here */}
        {/* For example, you can use a third-party library or your custom implementation */}
      </section>
    </div>
  )
}

export default ProviderPage
