import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  origin: {
    id: '',
    formattedAddress: '',
    location: {
      latitude: 40.7128,
      longitude: -74.006,
    },
  },
  destination: null,
  travelTimeInformation: null,
};

const navSlice = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setTravelTimeInformation: (state, action) => {
      state.travelTimeInformation = action.payload;
    },
  },
});

export const { setOrigin, setDestination, setTravelTimeInformation } = navSlice.actions;
export default navSlice.reducer;
