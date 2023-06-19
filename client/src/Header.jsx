import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className=' flex justify-between'>
      {/* logo top left */}
      <a href='' className='flex first-line:items-center gap-1'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke-width='1.5'
          stroke='currentColor'
          class='w-6 h-6 -rotate-180 font-bold'>
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            d='M15 10.5a3 3 0 11-6 0 3 3 0 016 0z'
          />
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z'
          />
        </svg>
        <span className='font-bold text-xl'>rinse</span>
      </a>
      {/* search bar */}
      <div className='flex gap-4 border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-300'>
        <div>Anytime</div>
        <div className='border border-l border-gray-300'></div>
        <div>Anywhere</div>
        <div className='border border-l border-gray-300'></div>
        <div>Anything</div>
        <button className='bg-primary text-white p-1 rounded-full'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke-width='1.5'
            stroke='currentColor'
            class='w-6 h-6'>
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
            />
          </svg>
        </button>
      </div>
      {/* hamburger & user */}
      <Link
        to={'/login'}
        className='flex gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-300'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke-width='1.5'
          stroke='currentColor'
          class='w-6 h-6 relative top-1'>
          <path
            fillRule='evenodd'
            d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
          />
        </svg>
        <div className='bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            class='w-6 h-6 relative top-1'>
            <path
              fill-rule='evenodd'
              d='M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z'
              clip-rule='evenodd'
            />
          </svg>
        </div>
      </Link>
    </header>
  );
}
