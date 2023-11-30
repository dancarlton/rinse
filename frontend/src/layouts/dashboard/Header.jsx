// import { themeChange } from 'theme-change';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { openRightDrawer } from '../../slices/rightDrawerSlice';
import { RIGHT_DRAWER_TYPES } from '../../utils/globalConstantUtil';

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faMoon, faSun } from '@fortawesome/free-regular-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';

function Header() {
  // const darkThemeOptions = ['dark', 'luxury', 'black'];
  // const lightThemeOptinos = ['light', 'corporate', 'lofi'];
  const dispatch = useDispatch();
  const { noOfNotifications, pageTitle } = useSelector((state) => state.header);
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('theme'));

  // useEffect(() => {
  //   themeChange(false);
  //   if (currentTheme === null) {
  //     if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  //       setCurrentTheme('black');
  //     } else {
  //       setCurrentTheme('lofi');
  //     }
  //   }
  //   // 👆 false parameter is required for react project
  // }, [currentTheme]);

  // Opening right sidebar for notification
  const openNotification = () => {
    dispatch(
      openRightDrawer({
        header: 'Notifications',
        bodyType: RIGHT_DRAWER_TYPES.NOTIFICATION,
      })
    );
  };

  function logoutUser() {
    localStorage.clear();
    window.location.href = '/';
  }

  return (
    <>
      <div className='navbar  flex justify-between bg-base-100  z-10 shadow-md '>
        {/* Menu toogle for mobile view or small screen */}
        <div className=''>
          <label htmlFor='left-sidebar-drawer' className='btn btn-primary drawer-button lg:hidden'>
            <FontAwesomeIcon className='h-5 inline-block w-5' icon={faBars} />
          </label>
          <h1 className='text-2xl font-semibold ml-2'>{pageTitle}</h1>
        </div>

        <div className='order-last'>
          {/* Multiple theme selection, uncomment this if you want to enable multiple themes selection.
          Themes need to be changed in tailwind.config file  as well*/}

          {/* <select
            className="select select-sm mr-4"
            defaultValue={currentTheme}
            onChange={(e) => setCurrentTheme(e.target.value)}
            data-choose-theme
          >
            <option disabled>Theme</option>
            <option value="light">Default</option>
            <option value="dark">Dark</option>
            <option value="corporate">Corporate</option>
            <option value="luxury">Luxury</option>
            <option value="lofi">Lofi</option>
            <option value="black">Black</option>
          </select> */}

          {/* Light and dark theme selection toogle **/}
          <label className='swap '>
            <input type='checkbox' />
            <FontAwesomeIcon
              icon={faSun}
              data-set-theme='lofi'
              data-act-class='ACTIVECLASS'
              className={
                'fill-current w-6 h-6 ' + (currentTheme === 'black' ? 'swap-on' : 'swap-off')
              }
            />
            <FontAwesomeIcon
              icon={faMoon}
              data-set-theme='black'
              data-act-class='ACTIVECLASS'
              className={
                'fill-current w-6 h-6 ' + (currentTheme === 'lofi' ? 'swap-on' : 'swap-off')
              }
            />
          </label>

          {/* Notification icon */}
          <button className='btn btn-ghost ml-4  btn-circle' onClick={() => openNotification()}>
            <div className='indicator'>
              <FontAwesomeIcon icon={faBell} className='h-6 w-6' />
              {noOfNotifications > 0 ? (
                <span className='indicator-item badge badge-secondary badge-sm'>
                  {noOfNotifications}
                </span>
              ) : null}
            </div>
          </button>

          {/* Profile icon, opening menu on click */}
          <div className='dropdown dropdown-end ml-4'>
            <label tabIndex={0} className='btn btn-ghost btn-circle avatar'>
              <div className='w-10 rounded-full'>
                <img src='https://picsum.photos/80/80' alt='profile' />
              </div>
            </label>
            <ul
              tabIndex={0}
              className='menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52'
            >
              <li className='justify-between'>
                <Link to={'/app/settings-profile'}>
                  Profile Settings
                  <span className='badge'>New</span>
                </Link>
              </li>
              <li className=''>
                <Link to={'/app/settings-billing'}>Bill History</Link>
              </li>
              <div className='divider mt-0 mb-0'></div>
              <li>
                <button onClick={logoutUser}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
