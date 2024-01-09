import PropTypes from 'prop-types';
import Geocoder from './Geocoder';
import RouteDetails from './RouteDetails';

const ProviderDetails = (props) => {
  return (
    // add styling
    <div>
      <Geocoder position={props.position} />
      <RouteDetails />
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
