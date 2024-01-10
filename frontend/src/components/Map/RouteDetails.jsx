import { useDispatch } from 'react-redux';
import { setDestination, setTravelTimeInformation } from '../../slices/navSlice';
import PropTypes from 'prop-types';

// Needs styling
const RouteDetails = (props) => {
  const { details } = props;
  const dispatch = useDispatch();

  const clearDirections = () => {
    props.directionsRenderer.setMap(null);
    dispatch(setDestination(null));
    dispatch(setTravelTimeInformation(null));
  };

  return (
    <>
      <div>
        <h2>
          {details.startAddress} to {details.endAddress}
        </h2>
        <div>via {details.summary}</div>
        <p>Distance: {details?.distance}</p>
        <p>Duration: {details?.duration}</p>
        <button onClick={clearDirections}>Remove Provider</button>
      </div>
    </>
  );
};

RouteDetails.propTypes = {
  details: PropTypes.shape({
    summary: PropTypes.string,
    startAddress: PropTypes.string.isRequired,
    endAddress: PropTypes.string.isRequired,
    distance: PropTypes.string,
    duration: PropTypes.string,
  }),
  directionsRenderer: PropTypes.object.isRequired,
};

export default RouteDetails;
