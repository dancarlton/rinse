import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { setOrigin } from "../slices/navSlice";
import { useDispatch } from "react-redux";
import { useLazyGetPlaceDetailsQuery } from "../slices/navSlice";

const AutoComplete = () => {
  const dispatch = useDispatch();
const [trigger, { data, error }] = useLazyGetPlaceDetailsQuery();

const handleSelect = (place) => {
  dispatch(setOrigin(place));
  if (place?.value?.place_id) {
    trigger(place.value.place_id); // This will execute the lazy query
  }
};


  return (
    <>
      <GooglePlacesAutocomplete
        selectProps={{
          onChange: handleSelect,
          placeholder: "Where would you like to search?",
        }}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={400}
        minLengthAutocomplete={2}
      />
    </>
  );
};

export default AutoComplete;
