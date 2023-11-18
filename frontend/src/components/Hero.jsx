import React from 'react'
import coverPhoto from '../assets/images/rinse-cover.jpeg'
import '../index.css'

const Hero = () => {
  return (
    <div
      data-theme='dark'
      className='hero bg-contain bg-center relative m-4 lg:w-[90%]'>
      <div className='hero-overlay bg-opacity-60 inset-0 rounded-md'>
        <img
          src={coverPhoto}
          className='px-0 max-w-3xl shadow-2xl bg-cover object-cover w-auto h-full rounded-md'
        />
      </div>
    </div>
  )
}

export default Hero
