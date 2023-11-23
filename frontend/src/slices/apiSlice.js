import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';

// Create a base query with the base URL for all API requests
const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

// Create an API slice using the Redux Toolkit
export const apiSlice = createApi({
  // Use the baseQuery created above for all API endpoints
  baseQuery,
  // Define tag types to label and manage cached data
  tagTypes: ['User'],
  // Define the API endpoints within the slice
  // Currently empty but is extended with API calls through other slices
  endpoints: (builder) => ({}),
});
