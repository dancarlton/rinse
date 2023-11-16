import React from "react";
import AutoComplete from "../components/AutoComplete";
import Map from "../components/Map";
import { useLoadScript } from "@react-google-maps/api";

const MapPage = () => {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const libraries = ["places"];
  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
    libraries,
  });
  return (
    <>
      {isLoaded && (
        <div className="flex flex-col w-full lg:flex-row">
          <div className="md:m-32 m-3 p-5 rounded max-h-64">
            <AutoComplete className="grid grow-2 h-full mx-32 my-32" />
          </div>
          <div className="grid grow md:h-[89vh] h-[60vh] mx-3">
            <Map />
          </div>
        </div>
      )}
    </>
  );
};
export default MapPage;
