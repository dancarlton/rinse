import { useState } from 'react';
import { AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarSide } from '@fortawesome/free-solid-svg-icons';

// Markers for provider positions
const ProviderMarker = (props) => {
  const selectProvider = () => {
    props.selectProvider();
  };
  return (
    <>
      <AdvancedMarker position={props.position} onClick={selectProvider}>
        <FontAwesomeIcon icon={faCarSide} size='xl' />
      </AdvancedMarker>
    </>
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
