import { useSelector } from 'react-redux';

const RouteDetails = () => {
  const travelTime = useSelector((state) => state.nav.travelTimeInformation);
  return (
    <>
      <div>
        <h2>{travelTime.summary}</h2>
        <p>Distance: {travelTime.leg?.distance}</p>
        <p>Duration: {travelTime.leg?.duration}</p>
      </div>
    </>
  );
};

export default RouteDetails;
