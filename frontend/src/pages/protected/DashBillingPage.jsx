import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import TitleCard from '../../components/Cards/TitleCard';
import { setPageTitle } from '../../slices/headerSlice';

function Billing() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle({ title: 'Billing' }));
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  return (
    <>
      <TitleCard title='Billing' topMargin='mt-2'>
        <div className='flex flex-col items-center justify-center py-20'>
          <h2 className='text-2xl font-bold mb-2'>Coming Soon</h2>
          <p className='text-gray-500'>Billing and payment features are under development.</p>
        </div>
      </TitleCard>
    </>
  );
}

export default Billing;
