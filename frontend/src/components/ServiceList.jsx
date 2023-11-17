import React from 'react'
import Card from './Card'
import '../index.css'
import sampleRinsers from '../data/sampleRinsers'

const ServiceList = () => {
  return (
    <div className='services-list max-w-xl'>
      {/* --------Choose a Wash------- */}
      <h1 className='text-3xl lg:text-4xl font-bold'>Choose a Wash</h1>
      {/* -------Recommended--------- */}
      <h2>Recommended</h2>
      <div className='carousel rounded-box'>
        {sampleRinsers.map(rinser => (
          <Card
            key={rinser.id}
            profileImage={rinser.profileImage}
            altText={rinser.altText}
            services={rinser.services[0]}
            reviews={rinser.reviews}
            serviceArea={rinser.serviceArea}
          />
        ))}
      </div>
      {/* <Card /> */}
      {/* --------- Best Deals --------- */}
      <h2>Best Deals</h2>
      <div className='carousel rounded-box'>
        {sampleRinsers.map(rinser => (
          <Card
            key={rinser.id}
            profileImage={rinser.profileImage}
            altText={rinser.altText}
            services={rinser.services[0]}
            reviews={rinser.reviews}
            serviceArea={rinser.serviceArea}
          />
        ))}
      </div>
      {/* -------- Quickest ---------- */}
      <h2>Quickest Service</h2>
      <div className='carousel rounded-box'>
        <div className='carousel-item'>
          <img src='/images/providers/stock1.jpg' alt='Burger' />
        </div>
        <div className='carousel-item'>
          <img src='/images/providers/stock2.jpg' alt='Burger' />
        </div>
        <div className='carousel-item'>
          <img src='/images/providers/stock3.jpg' alt='Burger' />
        </div>
        <div className='carousel-item'>
          <img src='/images/providers/stock6.jpg' alt='Burger' />
        </div>
        <div className='carousel-item'>
          <img src='/images/providers/stock7.jpg' alt='Burger' />
        </div>
      </div>
    </div>
  )
}

export default ServiceList
