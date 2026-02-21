import { useDispatch } from 'react-redux';
import { setDestination } from '../../slices/navSlice';
import PropTypes from 'prop-types';

const RouteDetails = (props) => {
  const { details } = props;
  const dispatch = useDispatch();

  const clearDirections = () => {
    props.clearRoute();
    dispatch(setDestination(null));
  };

  return (
    <div>
      <h2>
        {details.startAddress} to {details.endAddress}
      </h2>
      {details.summary && <div>via {details.summary}</div>}
      <p>Distance: {details?.distance}</p>
      <p>Duration: {details?.duration}</p>
      <button onClick={clearDirections}>Remove Provider</button>
    </div>
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
  clearRoute: PropTypes.func.isRequired,
};

export default RouteDetails;
