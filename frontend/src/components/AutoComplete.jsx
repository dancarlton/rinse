import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { setOrigin } from '../slices/navSlice';
import { useDispatch } from 'react-redux';
import { useLazyGetPlaceDetailsQuery } from '../slices/navSlice';

// https://developers.google.com/maps/documentation/places/web-service/autocomplete
// I think initially we can get current users location and set that as the center of the map instead of initial state which is 0,0
// this could be done in the navSlice, but maybe it would be better to do it here on initial render?
const AutoComplete = () => {
  const dispatch = useDispatch();
  const [trigger, { data, error }] = useLazyGetPlaceDetailsQuery();

  const handleSelect = async (place) => {
    if (place?.value?.place_id) {
      try {
        const res = await trigger(place.value.place_id).unwrap(); // This will execute the lazy query
        console.log(res);
        dispatch(setOrigin(res));
      } catch (e) {
        console.log('catch error: e');
        console.error(e);
        console.log('error from useLazyGetPlaceDetailsQuery: ');
        console.error(error);
        console.log('data from useLazyGetPlaceDetailsQuery: ');
        console.log(data);
      }
    }
  };

  return (
    <>
      <GooglePlacesAutocomplete
        selectProps={{
          onChange: handleSelect,
          placeholder: 'select location',
        }}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={400}
        minLengthAutocomplete={2}
      />
    </>
  );
};

export default AutoComplete;
