import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookingPage = () => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch providers based on the location selected by the user
    // TODO: replace the URL with your actual backend endpoint
    // TODO: Make this into a hook
    axios
      .get('https://your-backend.com/providers?location=chosenLocation')
      .then((response) => setProviders(response.data))
      .catch((error) => console.error('There was an error!', error));
  }, []);

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
  };

  const handleBookingComplete = (event) => {
    // TODO: Make this into a hook and implement this
    // Assuming Calendly widget emits an event upon booking completion
    // Extract booking info from `event` and post to your backend
    axios
      .post('https://your-backend.com/bookings', {
        providerId: selectedProvider.id,
        bookingDetails: event.data, // adjust based on actual event data structure
      })
      .then(() => navigate('/payment'))
      .catch((error) => console.error('There was an error!', error));
  };

  return (
    <div>
      <h2>Select a Provider</h2>
      <ul>
        {providers.map((provider) => (
          <li key={provider.id} onClick={() => handleProviderSelect(provider)}>
            {provider.name}
          </li>
        ))}
      </ul>
      {selectedProvider && (
        <div>
          <h3>Book with {selectedProvider.name}</h3>
          {/* Embed Calendly widget here. You might need to use a useEffect to properly initialize it after component mounts */}
          {/* Also, listen for the booking completion event to call handleBookingComplete */}
        </div>
      )}
    </div>
  );
};

export default BookingPage;
