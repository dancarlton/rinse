import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';

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

const asyncNavSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTravelTimeInformation: builder.query({
      query: ({ origin, destination, travelMode }) => ({
        url: `/api/directions`,
        method: 'POST',
        body: { origin, destination, travelMode },
      }),
    }),
  }),
});

export const { setOrigin, setDestination, setTravelTimeInformation } = navSlice.actions;
export const { useGetTravelTimeInformationQuery } = asyncNavSlice;
export default navSlice.reducer;
