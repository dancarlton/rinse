// External Libraries
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'

// Internal Modules/Pages
import store from './store.js'
import App from './App.jsx'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ContactPage from './pages/ContactPage'
import RegisterPage from './pages/RegisterPage'
import MapPage from './pages/MapPage'

// Route Modifiers
// import AdminRoute from "./components/AdminRoute.tsx";
// import PrivateRoute from "./components/PrivateRoute.tsx";

// Create the router with all the routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      {/* Public Routes */}
      <Route index={true} path='/' element={<HomePage />} />
      {/* The below two routes will be for searching and displaying service providers */}
      {/* <Route
        path="/search/:keyword"
        element={<HomeScreen />}
      />
      <Route
        path="/search/:keyword/page/:pageNumber"
        element={<HomeScreen />}
      /> */}
      <Route path='/login' element={<LoginPage />} />
      <Route path='/contact' element={<ContactPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/map' element={<MapPage />} />
    </Route>
  )
)

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
)
