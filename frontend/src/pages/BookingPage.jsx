import { useParams } from 'react-router-dom';
import { useGetOneUserQuery } from '../slices/usersSlice';

const BookingPage = () => {
  const { id } = useParams();
  const { data: providerData, isLoading, isError } = useGetOneUserQuery(id);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='loader'></div>
      </div>
    );
  }

  if (isError || !providerData) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p>Provider not found.</p>
      </div>
    );
  }

  return (
    <>
      <header className='bg-gray-100 py-4 px-6'>
        <div>
          <h1 className='text-2xl font-semibold'>Booking with: {providerData.name || 'Provider'}</h1>
        </div>
      </header>
      <div className='flex flex-col items-center justify-center py-20'>
        <h2 className='text-2xl font-bold mb-2'>Booking</h2>
        <p className='text-gray-500'>Online booking integration coming soon. Please contact the provider directly to schedule an appointment.</p>
      </div>
    </>
  );
};

export default BookingPage;
