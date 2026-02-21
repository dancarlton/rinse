import React from 'react';
import PropTypes from 'prop-types';
import '../index.css';
import { Link } from 'react-router-dom';

const Card = ({ service, providerName, providerId }) => {
  if (!service) return null;

  return (
    <Link to={`/provider/${providerId}`} className='card-link'>
      <div className='top-[191px] left-[407px] w-full h-[124px] border-2 border-solid border-slate-950 rounded-md flex items-center justify-between px-4 mb-1'>
        <img
          src={service.photo || './images/icons/exterior.png'}
          alt={service.title}
          className='w-16 h-16 object-cover'
        />
        <div className='flex-auto ml-6'>
          <h3 className='font-extrabold text-[20px]'>{service.title}</h3>
          <p className='text-[12px]'>{providerName || 'Provider'}</p>
          <p className='text-[14px] text-gray-500'>{service.description}</p>
        </div>
        <div>
          <h3 className='font-extrabold text-xl'>${service.price}</h3>
          {service.estimatedTime && (
            <p className='text-[12px] text-gray-500'>{service.estimatedTime} min</p>
          )}
        </div>
      </div>
    </Link>
  );
};

Card.propTypes = {
  providerName: PropTypes.string,
  providerId: PropTypes.string,
  service: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    estimatedTime: PropTypes.number,
    photo: PropTypes.string,
    price: PropTypes.number,
  }),
};

export default Card;
