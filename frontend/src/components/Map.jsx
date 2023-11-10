import { GoogleMap, InfoWindowF, MarkerF } from "@react-google-maps/api";
import { useMemo, useState } from "react";
import "../App.css";
import { useSelector } from "react-redux";
import { handle } from "express/lib/router";

const Map = () => {
  const [isMarkerShown, setIsMarkerShown] = useState(true);
  const latitude = useSelector((state) => state.nav.origin.location.latitude);
  const longitude = useSelector((state) => state.nav.origin.location.longitude);
  const center = useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [latitude, longitude]
  );
  const [activeMarker, setActiveMarker] = useState(null);
  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  const markers = [
    { id: 1, position: { lat: -34.397, lng: 150.644 }, name: "marker1" },
    { id: 2, position: { lat: 34.397, lng: 150.644 }, name: "marker2" },
    { id: 3, position: { lat: -34.397, lng: -150.644 }, name: "marker3" },
    { id: 4, position: { lat: 34.397, lng: -150.644 }, name: "marker4" },
  ];

  return (
    <>
      <GoogleMap
        mapContainerClassName="container h-screen w-full"
        center={center}
        zoom={10}
        className=""
        onClick={()=> handleActiveMarker(null)}>
        {markers.map((marker) => (
          <MarkerF key={marker.id} position={marker.position} onClick={() => handleActiveMarker(marker.id)}>
            {activeMarker === marker.id && (<InfoWindowF onCloseClick={()=>setActiveMarker(null)}>
              <div>{marker.id}</div>
            </InfoWindowF>)}
          </MarkerF>
        ))}
      </GoogleMap>
    </>
  );
};

export default Map;
