// External Libraries
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';

// Internal Modules/Pages
import store from './store.js';
import RootLayout from './layouts/RootLayout.jsx';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ContactPage from './pages/ContactPage';
import RegisterPage from './pages/RegisterPage';
import MapPage from './pages/MapPage';
import ProviderPage from './pages/ProviderPage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import DashboardLayout from './layouts/dashboard/DashboardLayout.jsx';

// Route Modifiers
// import AdminRoute from "./components/AdminRoute.tsx";
// import PrivateRoute from "./components/PrivateRoute.tsx";

// Create the router with all the routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/contact',
        element: <ContactPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/map',
        element: <MapPage />,
      },
      {
        path: '/provider/:name',
        element: <ProviderPage />,
      },
    ],
  },
  {
    path: '/dashboard/*',
    element: <DashboardLayout />,
    errorElement: <ErrorPage />,
  },
]);

// Render the React app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* HelmetProvider for managing all changes to the document head */}
    <HelmetProvider>
      {/* Redux store provider */}
      <Provider store={store}>
        {/* Router Provider for react-router-dom */}
        <RouterProvider router={router} />
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);
