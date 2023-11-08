import React from 'react'

const Hero = () => {
  return (
    <div
      data-theme="dark"
      className="hero min-h-screen"
      style={{
        backgroundImage:
          "url(https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg)",
      }}>
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-primary-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">Welcome to Rinse</h1>
          <p className="mb-5">
            The average car owner spends up to 13 hours and 15,000 gallons of
            water a year washing their car. Rinse is here to help you save time,
            water, and money by connecting you with a local detailer.
          </p>
          <button className="btn btn-primary">Get Rinsed</button>
          <button className="btn btn-primary">Get Rinsed</button>
        </div>
      </div>
    </div>
  );
}

export default Hero