import { useEffect, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import PropTypes from 'prop-types';

// Changes lat lng coordinates into addresses
// https://developers.google.com/maps/documentation/geocoding
const Geocoder = (props) => {
  const [result, setResult] = useState(null);

  const geocodingLibrary = useMapsLibrary('geocoding');
  const [geocodingService, setGeoCodingService] = useState(null);

  useEffect(() => {
    if (!geocodingLibrary) return;
    setGeoCodingService(new geocodingLibrary.Geocoder());
  }, [geocodingLibrary]);

  useEffect(() => {
    if (!geocodingService) return;

    // "location" key must be used to convert coordinates into addresses
    // Use "address" key with string value to convert address into coordinates
    geocodingService.geocode({ location: props.position }, (results, status) => {
      if (status === 'OK') {
        console.log('====================================');
        console.log('results', results);
        console.log('====================================');
        setResult(results[0].formatted_address);
      } else {
        // ! handle status
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }, [geocodingService, props.position]);

  return result;
};

Geocoder.propTypes = {
  position: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
};

export default Geocoder;
