import React from 'react'

const ServiceList = () => {
  return (
    <div className='services-list max-w-xl'>
      {/* Choose a Wash */}
      <h1 className='text-3xl lg:text-4xl font-bold'>Choose a Wash</h1>
      {/* Recommended */}
      <h2>Recommended</h2>
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
          <img src='/images/providers/stock4.jpg' alt='Burger' />
        </div>
      </div>
      {/* Best Deals */}
      <h2>Best Deals</h2>
      <div className='carousel rounded-box'>
        <div className='carousel-item'>
          <img src='/images/providers/stock4.jpg' alt='Burger' />
        </div>
        <div className='carousel-item'>
          <img src='/images/providers/stock5.jpg' alt='Burger' />
        </div>
        <div className='carousel-item'>
          <img src='/images/providers/stock6.jpg' alt='Burger' />
        </div>
        <div className='carousel-item'>
          <img src='/images/providers/stock7.jpg' alt='Burger' />
        </div>
      </div>
      {/* Quickest */}
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
