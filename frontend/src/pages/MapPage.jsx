import React from "react";
import PropTypes from "prop-types";
import AutoComplete from "../components/AutoComplete";
import Map from "../components/Map";
import { useLoadScript } from "@react-google-maps/api";

const MapPage = (props) => {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const libraries = ["places"];
  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
    libraries,
  });
  return (
    <>
      {isLoaded && (
        <>
          <AutoComplete />
          <div>SearchPage</div>
          <Map />
        </>
      )}
    </>
  );
};

MapPage.propTypes = {};

export default MapPage;
