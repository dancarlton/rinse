import { GoogleMap, Marker } from "@react-google-maps/api";
import { useMemo, useState } from "react";
import "../App.css";
import { useSelector } from "react-redux";

const Map = () => {
  const [isMarkerShown, setIsMarkerShown] = useState(true);
  const latitude = useSelector((state) => state.nav.origin.location.latitude);
  const longitude = useSelector((state) => state.nav.origin.location.longitude);
  const center = useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [latitude, longitude]
  );

  return (
    <>
      <GoogleMap
        mapContainerClassName="container h-screen w-full"
        center={center}
        zoom={10}
        className="">
        {isMarkerShown && (
          <Marker position={center} />
        )}
      </GoogleMap>
    </>
  );
};

export default Map;
