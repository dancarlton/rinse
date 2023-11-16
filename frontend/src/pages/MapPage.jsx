import React from 'react'
import AutoComplete from '../components/AutoComplete'
import { useLoadScript } from '@react-google-maps/api'

import Map from '../components/Map'
import ServiceSearch from '../components/ServiceSearch'
import ServiceList from '../components/ServiceList'

const MapPage = () => {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const libraries = ['places']
  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
    libraries,
  })
  return (
    <div className='flex flex-col lg:flex-row mt-10 lg:space-x-4 lg:space-y-4'>
      <ServiceSearch
        style={{ minWidth: '100px', width: '150px' }}
        className='min-w-service-search wider-service-search'
      />
      <ServiceList className='my-4 mx-2' />
      {isLoaded && (
        <div className='lg:flex lg:w-[60%] space-y-4'>
          {/* <div className="md:m-32 m-3 p-5 rounded max-h-64">
            <AutoComplete className="grid grow-2 h-full mx-32 my-32" />
          </div> */}
          <div className='grid grow md:h-[89vh] lg:h-[80vh] lg:w-[60%] mx-3'>
            <Map />
          </div>
        </div>
      )}
    </div>
  )
}
export default MapPage
