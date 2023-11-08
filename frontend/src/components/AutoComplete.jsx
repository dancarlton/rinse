import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { setOrigin, useGetPlaceDetailsQuery } from "../slices/navSlice";
import { useDispatch, useSelector } from "react-redux";

// https://tintef.github.io/react-google-places-autocomplete/
const AutoComplete = () => {
  const dispatch = useDispatch();
  const [getPlaceDetails] = useGetPlaceDetailsQuery();

  return (
    <>
      <GooglePlacesAutocomplete
        selectProps={{
          onChange: (e) => {
            // when the user selects an address from autocomplete, the info is put into redux state under state.nav.origin
            dispatch(setOrigin(e));
            // get the place details from the Google Places API
            const { data } = getPlaceDetails(e.value);
            console.log(data)
          },
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
