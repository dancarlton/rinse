import { Marker } from 'react-map-gl';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarSide } from '@fortawesome/free-solid-svg-icons';

const ProviderMarker = (props) => {
  return (
    <Marker
      latitude={props.position.lat}
      longitude={props.position.lng}
      onClick={props.selectProvider}
      anchor='center'
    >
      <FontAwesomeIcon icon={faCarSide} size='xl' />
    </Marker>
  );
};

ProviderMarker.propTypes = {
  position: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  selectProvider: PropTypes.func.isRequired,
};

export default ProviderMarker;
