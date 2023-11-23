import React from 'react';
import PropTypes from 'prop-types';
import '../index.css';
import { Link } from 'react-router-dom';

const Card = ({ id, profileImage, name, altText, services, reviews, serviceArea }) => {
  return (
    <Link to={`/provider/${name}`} className="card-link">
      {/* Option 1 (built from scratch) */}
      <div className="contacts">
        <div className="carousel-item rounded-box card-container flex-col">
          <div>
            <img
              src={profileImage || 'images/icons/service-missing.png'}
              alt={altText}
              className="card-img border-black"
            />
          </div>
          <div className="bg-white">
            <div className="flex">
              <h1 className="card-title font-bold">{services.name}</h1>
              <p className="font-light mt-2.5 text-slate-500">({reviews.length})</p>
            </div>
            <div className="card-description mt-0">
              <p className="font-semibold">${services.price}</p>
              <span className="font-normal">{serviceArea}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

Card.propTypes = {
  id: PropTypes.string.isRequired,
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
};

export default Card;
