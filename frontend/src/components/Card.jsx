import React from 'react';
import PropTypes from 'prop-types';
import '../index.css';
import { Link } from 'react-router-dom';

// const Card = ({ service, servicerName, numReviews, serviceArea }) => {
//   return (
//     <Link to={`/provider/${servicerName}`} className='card-link'>
//       {/* Option 1 (built from scratch) */}
//       <div className='contacts'>
//         <div className='carousel-item rounded-box card-container flex-col'>
//           <div>
//             <img
//               src={service.photo || 'images/icons/service-missing.png'}
//               alt='A car being serviced'
//               className='card-img border-black'
//             />
//           </div>
//           <div className='bg-white'>
//             <div className='flex'>
//               <h1 className='card-title font-bold'>{service.name}</h1>
//               <p className='font-light mt-2.5 text-slate-500'>({numReviews})</p>
//             </div>
//             <div className='card-description mt-0'>
//               <p className='font-semibold'>${service.price}</p>
//               <span className='font-normal'>{serviceArea}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

const Card = () => {
  return (
    <Link>
      <div className='top-[191px] left-[407px] w-full h-[124px] border-2 border-solid border-slate-950 rounded-md flex items-center justify-between px-4 mb-1'>
        <img src='./images/icons/exterior.png' alt='Exterior Wash Icon' className='w-16 h-16' />
        <div className='flex-auto ml-6'>
          <h3 className='font-extrabold text-[20px] '>Exterior Wash</h3>
          <p className='text-[12px]'>7 available today</p>
          <p className='text-[14px] text-gray-500'>Outer clean for a polished look</p>
        </div>
        <div>
          <h3 className='font-extrabold text-xl'>$85 - $120</h3>
        </div>
      </div>
    </Link>
  );
};

Card.propTypes = {
  servicerName: PropTypes.string,
  service: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    estimatedTime: PropTypes.number,
    photo: PropTypes.string,
    rating: PropTypes.number,
    price: PropTypes.number,
  }),
  numReviews: PropTypes.number,
  serviceArea: PropTypes.string,
};

export default Card;
