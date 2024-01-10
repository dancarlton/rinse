import PropTypes from 'prop-types';

const RouteDetails = (props) => {
  return (
    <>
      <div>
        <h2>
          {props.leg.startAddress} to {props.leg.endAddress}
        </h2>
        <div>via {props.summary}</div>
        <p>Distance: {props.leg?.distance}</p>
        <p>Duration: {props.leg?.duration}</p>
        <button onClick={() => props.directionsRenderer.setMap(null)}>Remove Provider</button>
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
