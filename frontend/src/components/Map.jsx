import { GoogleMap } from "@react-google-maps/api";
import { useMemo } from "react";
import "../App.css";


const Map = () => {


  const center = useMemo(() => ({ lat: 18.52043, lng: 73.856743 }), []);

  return (
    <>
        <GoogleMap
          mapContainerClassName="container h-screen w-full"
          center={center}
          zoom={10}
          className=""
        />
    </>
  );
};

export default Map;
