import { useDispatch, useSelector } from 'react-redux';
import NotificationBodyRightDrawer from '../../components/NotificationBodyRightDrawer';
import { closeRightDrawer } from '../../slices/rightDrawerSlice';
import { RIGHT_DRAWER_TYPES } from '../../utils/globalConstantUtil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

/* 
To add new content follow these steps:
1. Create new component file containing main body of your content that you want to appear in the right drawer
An example we have is in components/NotificationBodyRightDrawer
2. Create new variable in /utils/globalConstantUtils.js file under RIGHT_DRAWER_TYPES variable. Follow the same naming convention as in the file.
3. Now include the file mapped with the new variable in /layouts/dashboard/RightSidebar.js file (the file you're currently in) using the ternary that is set up.
For ex- If you new component name is TestRightSideBar.js and the RIGHT_DRAWER_TYPES variable name is TEST_RIGHT_SIDEBAR, then add following code inside ternary code block
  {
    [RIGHT_DRAWER_TYPES.NOTIFICATION]: (
      <NotificationBodyRightDrawer {...extraObject} closeRightDrawer={close} />
    ),
    [RIGHT_DRAWER_TYPES.TEST_RIGHT_SIDEBAR] : (
      <TestRightSideBar {...extraObject} closeRightDrawer={close}/>
    ),
    [RIGHT_DRAWER_TYPES.DEFAULT]: <div></div>,
  }[bodyType]
                
Here extraObject has variables that are passed from parent component while calling openRightDrawer method
4. Now the last step, call dispatch method as follows wherever you want to open the right drawer. 
  For instance notification icon in layouts/dashboard/header.js file opens the notification drawer
 dispatch(openRightDrawer({header : "Test Right Drawer", bodyType : RIGHT_DRAWER_TYPES.TEST_RIGHT_SIDEBAR}))
*/
function RightSidebar() {
  const { isOpen, bodyType, extraObject, header } = useSelector((state) => state.rightDrawer);
  const dispatch = useDispatch();

  const close = (e) => {
    dispatch(closeRightDrawer(e));
  };

  return (
    <div
      className={
        ' fixed overflow-hidden z-20 bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out ' +
        (isOpen
          ? ' transition-opacity opacity-100 duration-500 translate-x-0  '
          : ' transition-all delay-500 opacity-0 translate-x-full  ')
      }
    >
      <section
        className={
          'w-80 md:w-96  right-0 absolute bg-base-100 h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform  ' +
          (isOpen ? ' translate-x-0 ' : ' translate-x-full ')
        }
      >
        <div className='relative  pb-5 flex flex-col  h-full'>
          {/* Header */}
          <div className='navbar   flex pl-4 pr-4   shadow-md '>
            <button
              className='float-left btn btn-circle btn-outline btn-sm'
              onClick={() => close()}
            >
              <FontAwesomeIcon icon={faXmark} className='h-5 w-5' />
            </button>
            <span className='ml-2 font-bold text-xl'>{header}</span>
          </div>

          {/* ------------------ Content Start ------------------ */}
          <div className='overflow-y-scroll pl-4 pr-4'>
            <div className='flex flex-col w-full'>
              {/* Loading drawer body according to different drawer type */}
              {
                {
                  [RIGHT_DRAWER_TYPES.NOTIFICATION]: (
                    <NotificationBodyRightDrawer {...extraObject} closeRightDrawer={close} />
                  ),
                  [RIGHT_DRAWER_TYPES.DEFAULT]: <div></div>,
                }[bodyType]
              }
            </div>
          </div>
          {/* ------------------ Content End ------------------ */}
        </div>
      </section>

      <section className=' w-screen h-full cursor-pointer ' onClick={() => close()}></section>
    </div>
  );
}

export default RightSidebar;
