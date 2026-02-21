import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../slices/headerSlice';

function Calendar() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Calendar' }));
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  return (
    <>
      {/* TODO: Replace with user's Calendly URL from profile */}
      <div className='flex flex-col items-center justify-center py-20'>
        <h2 className='text-2xl font-bold mb-2'>Calendar</h2>
        <p className='text-gray-500'>Calendar integration coming soon. Connect your Calendly account in profile settings.</p>
      </div>
    </>
  );
}

export default Calendar;
