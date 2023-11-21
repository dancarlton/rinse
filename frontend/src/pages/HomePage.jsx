// import Hero from '../components/Hero'
import ServiceSearch from '../components/ServiceSearch'
import coverPhoto from '../assets/images/rinse-cover.jpeg'

const HomePage = () => (
  <div className='flex flex-col lg:flex-row p-6 w-full xl:items-center '>
    {/* Search For Services */}
    <div className='lg:order-1 xl:w-[600px] 2xl:w-[1000px]'>
      <ServiceSearch />
    </div>

    {/* Hero Components */}
    <div className='lg:order-2'>
      <img
        src={coverPhoto}
        alt='Cover'
        className='w-full h-full object-cover max-h-screen inset-0 rounded-md overflow-hidden xl:max-h-screen xl:w-auto xl:h-auto 2xl:mr-10 xl:mt-[-50px]'
      />
    </div>
  </div>
)

export default HomePage
