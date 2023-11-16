import React from 'react';
import coverPhoto from '../assets/images/rinse-cover.jpeg';
import '../index.css';

const Hero = () => {
  return (
    <div
      data-theme="dark"
      className="hero-content min-h-screen w-3/4 bg-cover bg-center relative m-4 max-h-screen-2"
      style={{ backgroundImage: `url(${coverPhoto})` }}
    >
      <div className="hero-overlay bg-opacity-60 absolute inset-0"></div>
      <div className="hero-content text-center text-primary-content absolute inset-0 flex items-center justify-center">
        <div className="max-w-md p-4 text-white">
          <h1 className="mb-5 text-5xl font-bold">Welcome to Rinse</h1>
          <p className="mb-5">
            The average car owner spends up to 13 hours and 15,000 gallons of
            water a year washing their car. Rinse is here to help you save time,
            water, and money by connecting you with a local detailer.
          </p>
          <button className="btn btn-primary mr-3">Get Rinsed</button>
          <button className="btn btn-primary ml-3">Do The Rinsing</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
