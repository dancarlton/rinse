import PropTypes from 'prop-types';

const RouteDetails = (props) => {
  return (
    <>
      <div>
        <h2>{props.summary}</h2>
        <p>Distance: {props.leg?.distance}</p>
        <p>Duration: {props.leg?.duration}</p>
        <button onClick={() => props.directionsRenderer.setMap(null)}>Clear Route</button>
      </div>
    </>
  );
};

RouteDetails.propTypes = {
  summary: PropTypes.string,
  leg: PropTypes.shape({
    startAddress: PropTypes.string.isRequired,
    endAddress: PropTypes.string.isRequired,
    distance: PropTypes.string,
    duration: PropTypes.string,
  }),
  directionsRenderer: PropTypes.object.isRequired,
};

export default RouteDetails;
