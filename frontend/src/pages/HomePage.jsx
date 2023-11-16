import Hero from '../components/Hero'
import ServiceSearch from '../components/ServiceSearch'

const HomePage = () => (
  <div className='hero-content flex flex-col lg:flex-row sm:min-h-fit'>
    {/* Search For Services */}
    <div className='lg:w-1/2 lg:order-1'>
      <ServiceSearch />
    </div>

    {/* Hero Components */}
    <div className=' lg:order-2'>
      <Hero/>
    </div>
  </div>
)

export default HomePage
