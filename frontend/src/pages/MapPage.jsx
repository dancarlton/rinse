import Map from '../components/Map/index';
import ServiceSearchMap from '../components/ServiceSearchMap';
import ServiceList from '../components/ServiceList';
import { useSelector } from 'react-redux';

const MapPage = () => {
  const latitude = useSelector((state) => state.nav.origin.location.latitude);

  return (
    <div className='flex flex-col-reverse justify-between lg:flex-row w-full absolute px-10 py-3'>
      <div className=''>
        <ServiceSearchMap />
      </div>

      {latitude !== 0 && <ServiceList className='' />}

      <div>
        <div className='grid grow h-[650px] lg:w-[420px] left-[960px] rounded-md'>
          <Map />
        </div>
      </div>
    </div>
  );
};

export default MapPage;
