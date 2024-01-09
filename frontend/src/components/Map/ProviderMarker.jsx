import { useState } from 'react';
import { AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarSide } from '@fortawesome/free-solid-svg-icons';

// Markers for provider positions
const ProviderMarker = (props) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(false);
  };
  return (
    <>
      <AdvancedMarker position={props.position} onClick={() => setOpen(true)}>
        <FontAwesomeIcon icon={faCarSide} size='xl' />
      </AdvancedMarker>
      {open && (
        <InfoWindow position={props.position} onCloseClick={() => setOpen(false)}>
          <div>
            {/* This button needs styling */}
            <button onClick={handleClick}>Select this Provider</button>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

ProviderMarker.propTypes = {
  position: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProviderMarker;
