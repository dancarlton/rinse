import { useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';

// Custom hook to retrieve map instance, and init directions library services
const useDirections = () => {
  // get map instance
  const map = useMap();

  // load routes google maps library
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = useState();
  const [directionsRenderer, setDirectionsRenderer] = useState();

  // init services
  useEffect(() => {
    if (!routesLibrary || !map) return;
    // create instances and set in state
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  return { directionsService, directionsRenderer, map };
};

export default useDirections;
