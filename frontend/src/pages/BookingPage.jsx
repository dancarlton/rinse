import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCalendlyEventListener, InlineWidget } from 'react-calendly';
import { useParams } from 'react-router-dom';
const BookingPage = () => {
  const { name } = useParams();
  // TODO: Change this to store the selected provider from before so we don't have to call the backend twice here. Maybe useMemo or stored in state?
  const [providerData, setProviderData] = useState(true);
  const navigate = useNavigate();

  /*   const handleBookingComplete = (event) => {
    useCalendlyEventListener({
      onProfilePageViewed: () => console.log('onProfilePageViewed'),
      onDateAndTimeSelected: () => console.log('onDateAndTimeSelected'),
      onEventTypeViewed: () => console.log('onEventTypeViewed'),
      onEventScheduled: (e) => console.log(e.data.payload),
    });
    TODO: Make this into a hook and implement this
    Assuming Calendly widget emits an event upon booking completion
    Extract booking info from `event` and post to your backend
    axios
      .post('https://your-backend.com/bookings', {
        providerId: selectedProvider.id,
        bookingDetails: event.data, // adjust based on actual event data structure
      })
      .then(() => navigate('/payment'))
      .catch((error) => console.error('There was an error!', error));
  }; */

  useEffect(() => {
    // Add in as much prefilled data as possible. User name, User email, User service chosen in the additional details.
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    async function doIt() {
      // TODO: Change the url to not mine.
      axios.get('https://api.calendly.com/user_availability_schedules/vguzman812', {
        headers: {
          Authorization: 'Bearer ' + import.meta.env.VITE_, //the token is a variable which holds the token
        },
      });
    }
  }, []);

  return (
    <>
      <header className='bg-gray-100 py-4 px-6'>
        {providerData && (
          <div>
            {/* Display the provider's name and chosen service */}
            <h1 className='text-2xl font-semibold'>Booking with: {providerData.name}</h1>
            <p>You selected: {providerData.service}</p>
          </div>
        )}
      </header>
      <div id='calendly-embed'>
        <InlineWidget url='https://calendly.com/vguzman812' styles={{ height: '80vh' }} />
      </div>
    </>
  );
};

export default BookingPage;
