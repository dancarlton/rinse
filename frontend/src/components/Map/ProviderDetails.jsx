import PropTypes from 'prop-types';
import Geocoder from './Geocoder';
import RouteDetails from './RouteDetails';
import { useSelector } from 'react-redux';

const ProviderDetails = (props) => {
  const travelTime = useSelector((state) => state.nav.travelTimeInformation);
  return (
    // add styling
    <div>
      <Geocoder position={props.position} />
      {travelTime && <RouteDetails />}
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
