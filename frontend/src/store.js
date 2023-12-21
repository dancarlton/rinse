import { configureStore } from '@reduxjs/toolkit';

import { apiSlice } from './slices/apiSlice';
import authSliceReducer from './slices/authSlice';
import navSliceReducer from './slices/navSlice';
import modalSliceReducer from './slices/modalSlice';
import headerSlice from './slices/headerSlice';
import rightDrawerSlice from './slices/rightDrawerSlice';

// Configure the RTK store
const store = configureStore({
  // Define the reducers used in the application
  reducer: {
    // Add the API slice reducer under its reducer path
    [apiSlice.reducerPath]: apiSlice.reducer,

    // Add the authentication and nav slice reducers
    auth: authSliceReducer,
    nav: navSliceReducer,
    modal: modalSliceReducer,
    header: headerSlice,
    rightDrawer: rightDrawerSlice,
  },
  // Define the middleware used in the application
  middleware: (getDefaultMiddleware) =>
    // Get the default middleware and append the middleware from the API slice
    getDefaultMiddleware().concat(apiSlice.middleware),

  // Enable Redux DevTools for debugging
  devTools: true,
});

// Export the configured store
export default store;
