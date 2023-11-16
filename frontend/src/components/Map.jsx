import { GoogleMap, InfoWindowF, MarkerF } from "@react-google-maps/api";
import { useMemo, useState } from "react";
import "../App.css";
import { useSelector } from "react-redux";
import { handle } from "express/lib/router";

// Combination of https://github.com/JustFly1984/react-google-maps-api/tree/master/packages/react-google-maps-api
// and https://tomchentw.github.io/react-google-maps/
// When user selects new autocomplete location, center variable gets re calculated and the map will recenter to that location
const Map = () => {
  const latitude = useSelector((state) => state.nav.origin.location.latitude);
  const longitude = useSelector((state) => state.nav.origin.location.longitude);
  const center = useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [latitude, longitude]
  );

  return (
    <>
      <GoogleMap
        mapContainerClassName="max-w-sm"
        center={center}
        zoom={10}
        className=''>
        <MarkerF position={center}></MarkerF>
      </GoogleMap>
    </>
  );
};

export default Map;
