import Hero from '../components/Hero'

const HomePage = () => (
  <div className='flex justify-center items-center min-h-screen'>
    <div className='lg:w-1/2 p-5 m-5 space-y-8'>
      <h1 className='text-4xl lg:text-6xl font-bold text-gray-300 mt-0 mb-8 lg:mb-0'>
        Get clean anywhere <br /> with Rinse.
      </h1>
      <div className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Enter Location'
          className='input input-bordered input-primary w-full max-w-xs'
        />
        <details className='dropdown'>
          <summary className='m-1 btn'>Choose Service</summary>
          <ul className='p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52'>
            <li>
              <a>Exterior</a>
            </li>
            <li>
              <a>Interior</a>
            </li>
            <li>
              <a>Both</a>
            </li>
          </ul>
        </details>
        <button className='btn btn-xs sm:btn-sm md:btn-md lg:btn-lg mt-4 lg:mt-0'>
          See Prices
        </button>
      </div>
    </div>
    <Hero />
  </div>
)

export default HomePage
