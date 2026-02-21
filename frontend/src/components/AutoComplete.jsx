import { useState, useCallback } from 'react';
import { setOrigin } from '../slices/navSlice';
import { useDispatch } from 'react-redux';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const AutoComplete = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = useCallback(async (value) => {
    setQuery(value);
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?access_token=${MAPBOX_TOKEN}&limit=5`
      );
      const data = await res.json();
      setSuggestions(data.features || []);
    } catch (err) {
      console.error('Geocoding error:', err);
    }
  }, []);

  const handleSelect = (feature) => {
    setQuery(feature.place_name);
    setSuggestions([]);
    dispatch(
      setOrigin({
        id: feature.id,
        formattedAddress: feature.place_name,
        location: {
          latitude: feature.center[1],
          longitude: feature.center[0],
        },
      })
    );
  };

  return (
    <div className='relative'>
      <input
        type='text'
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder='Search location...'
        className='input input-bordered w-full'
      />
      {suggestions.length > 0 && (
        <ul className='absolute z-50 bg-base-100 shadow-lg rounded-lg w-full mt-1 max-h-60 overflow-y-auto'>
          {suggestions.map((feature) => (
            <li
              key={feature.id}
              onClick={() => handleSelect(feature)}
              className='p-2 hover:bg-base-200 cursor-pointer text-sm'
            >
              {feature.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoComplete;
