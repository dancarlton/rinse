import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { setOrigin } from "../slices/navSlice";
import { useDispatch } from "react-redux";
import { useLazyGetPlaceDetailsQuery } from "../slices/navSlice";
import { set } from "mongoose";

const AutoComplete = () => {
  const dispatch = useDispatch();
const [trigger, { data, error }] = useLazyGetPlaceDetailsQuery();

const handleSelect = async (place) => {
  dispatch(setOrigin(place));
  if (place?.value?.place_id) {
    const res = await trigger(place.value.place_id).unwrap(); // This will execute the lazy query
    console.log(res)
    dispatch(setOrigin(res));
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
