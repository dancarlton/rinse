import PropTypes from 'prop-types';

const Avatar = ({ source, name }) => {
  return (
    <div className='avatar online mr-2'>
      <div className='w-12 h-12 rounded-full overflow-hidden ml-5'>
        <img
          src={source || 'https://picsum.photos/80/80'}
          alt={`${name}'s Avatar`}
          className='object-cover w-full h-full'
        />
      </div>
    </div>
  );
};

Avatar.propTypes = {
  source: PropTypes.string,
  name: PropTypes.string,
};

export default Avatar;
