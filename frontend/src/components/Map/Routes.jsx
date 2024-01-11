import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { setTravelTimeInformation } from '../../slices/navSlice';

// Renders directions from current position to provider location
const Routes = (props) => {
  const dispatch = useDispatch();
  const { directionsService, directionsRenderer, map } = props;

  // find a route using the directionsService
  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;
    directionsService
      .route({
        origin: props.origin,
        destination: props.destination,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        // set Map instance in case directions are cleared
        directionsRenderer.setMap(map);
        directionsRenderer.setDirections(response);
        // First routes is the fastest
        const route = {
          summary: response.routes[0].summary,
          startAddress: response.routes[0].legs[0].start_address,
          endAddress: response.routes[0].legs[0].end_address,
          duration: response.routes[0].legs[0]?.duration?.text,
          distance: response.routes[0].legs[0]?.distance?.text,
        };
        dispatch(setTravelTimeInformation(route));
      });
  }, [directionsService, directionsRenderer, map, props.origin, props.destination, dispatch]);

  return <></>;
};

Routes.propTypes = {
  origin: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  destination: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  directionsService: PropTypes.object.isRequired,
  directionsRenderer: PropTypes.object.isRequired,
  map: PropTypes.object.isRequired,
};

export default Routes;
