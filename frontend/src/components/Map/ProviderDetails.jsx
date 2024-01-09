import PropTypes from 'prop-types';

const ProviderDetails = (props) => {
  return (
    <div>
      {props.position.lat}
      {props.position.lng}
    </div>
  );
};

ProviderDetails.propTypes = {
  position: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
};
export default ProviderDetails;
