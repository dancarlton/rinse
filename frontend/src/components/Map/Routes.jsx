import { useEffect, useState } from 'react';
import { useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { setTravelTimeInformation } from '../../slices/navSlice';

// Renders directions from current position to provider location
const Routes = (props) => {
  const map = useMap();

  // load routes google maps library
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = useState();
  const [directionsRenderer, setDirectionsRenderer] = useState();

  const dispatch = useDispatch();

  // init services
  useEffect(() => {
    if (!routesLibrary || !map) return;
    // create instance and set in state
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

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
        directionsRenderer.setDirections(response);
        // First routes is the fastest
        const route = {
          summary: response.routes[0].summary,
          leg: {
            startAddress: response.routes[0].legs[0].start_address,
            endAddress: response.routes[0].legs[0].end_address,
            duration: response.routes[0].legs[0]?.duration?.text,
            distance: response.routes[0].legs[0]?.distance?.text,
          },
        };
        dispatch(setTravelTimeInformation(route));
      });
  }, [directionsService, directionsRenderer, props.origin, props.destination, dispatch]);

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
};

export default Routes;
