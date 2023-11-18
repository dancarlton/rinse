import React from 'react'
import PropTypes from 'prop-types'
import '../index.css'

const Card = ({
  profileImage,
  name,
  altText,
  services,
  reviews,
  serviceArea,
}) => {
  return (
    // Option 1 (built from scratch)
    <div className='contacts'>
      <div className='carousel-item rounded-box card-container flex-col'>
        <div>
          <img src={profileImage} alt={altText} className='card-img border-black' />
        </div>
        <div className='bg-white'>
          <div className='flex'>
            <h1 className='card-title font-bold'>{services.name}</h1>
            <p className='font-light mt-2.5 text-slate-500'>({reviews.length})</p>
          </div>
          <div className='card-description mt-0'>
            <p className='font-semibold'>${services.price}</p>
            <span className='font-normal'>{serviceArea}</span>
          </div>
        </div>
      </div>
    </div>

    // From Scrimba
    // <div className='contacts'>
    //   <div className='contact-card'>
    //     <img src={profileImage} alt={altText} />
    //     <h3>{services.name} ({reviews.length})</h3>
    //     <h3>{name}</h3>
    //     <h1>{services.price}</h1>
    //     <p>{serviceArea}</p>
    //   </div>
    // </div>

    // Option 2
    // <div className='card w-96 bg-base-100 shadow-xl image-full'>
    //   <figure>
    //     <img
    //       src='/images/providers/stock3.jpg'
    //       alt='Shoes'
    //     />
    //   </figure>
    //   <div className='card-body'>
    //     <h2 className='card-title'>Shoes!</h2>
    //     <p>If a dog chews shoes whose shoes does he choose?</p>
    //     <div className='card-actions justify-end'>
    //       <button className='btn btn-primary'>Buy Now</button>
    //     </div>
    //   </div>
    // </div>

    // Option 3
    // <div className='card w-96 glass'>
    //   <figure>
    //     <img src='/images/providers/stock3.jpg' alt='car!' />
    //   </figure>
    //   <div className='card-body'>
    //     <h2 className='card-title'>Life hack</h2>
    //     <p>How to park your car at your garage?</p>
    //     <div className='card-actions justify-end'>
    //       <button className='btn btn-primary'>Learn now!</button>
    //     </div>
    //   </div>
    // </div>
  )
}

Card.propTypes = {
  profileImage: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired,
  services: PropTypes.arrayOf(
    PropTypes.shape({
      rating: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  reviews: PropTypes.string.isRequired,
  serviceArea: PropTypes.string.isRequired,
}

export default Card
