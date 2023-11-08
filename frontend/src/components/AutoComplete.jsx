import React, { useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

// https://tintef.github.io/react-google-places-autocomplete/
const AutoComplete = () => {

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [value, setValue] = useState(null);

  return (
    <div>
      <GooglePlacesAutocomplete
        selectProps={{
          value,
          onChange: setValue,
        }}
        apiKey={apiKey}
        placeholder="Where would you like to search?"
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={400}
        minLengthAutocomplete={1}
      />
    </div>
  );
};

export default AutoComplete;
