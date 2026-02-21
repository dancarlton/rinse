import AutoComplete from './AutoComplete';

const ServiceSearchMap = () => {
  return (
    <div className='hero bg-base-300 w-80 rounded-xl shadow-xs border-slate-800'>
      <div className='flex justify-center gap-4 flex-col lg:flex-row-reverse w-full xl:items-center'>
        <div className='card w-full max-w-sm shadow-2xl bg-base-100'>
          <form className='card-body max-w-screen'>
            <div className='form-control'>
              <label className='label'>
                <span className='text-lg'>Get Rinsed</span>
              </label>
              <div className='flex-row items-stretch justify-around'>
                <AutoComplete />
              </div>
            </div>
            <div className='form-control mt-6'>
              <button className='btn btn-primary'>schedule now</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceSearchMap;
