import routes from '../../routes/sidebarRoutes';
import { NavLink, Link, useLocation } from 'react-router-dom';
import SidebarSubmenu from './SidebarSubmenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

function LeftSidebar() {
  const location = useLocation();

  const close = (e) => {
    document.getElementById('left-sidebar-drawer').click();
  };

  return (
    <div className="drawer-side">
      <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
      <ul className="menu  pt-2 w-80 bg-base-100 text-base-content">
        <button
          className="btn btn-ghost bg-base-300  btn-circle z-50 top-0 right-0 mt-4 mr-2 absolute lg:hidden"
          onClick={() => close()}
        >
          <FontAwesomeIcon icon={faXmark} className="h-5 inline-block w-5" />
        </button>

        <li className="mb-2 font-semibold text-xl">
          <Link to={'/'}>
            <img
              className="mask mask-squircle w-10"
              src="https://picsum.photos/80/80"
              alt="Rinse Logo"
            />
            Rinse
          </Link>{' '}
        </li>
        {routes.map((route, k) => {
          return (
            <li key={k}>
              {route.submenu && route.name ? ( // Ensure that both submenu and name exist
                <SidebarSubmenu {...route} />
              ) : (
                <NavLink
                  end
                  to={route.path}
                  className={({ isActive }) =>
                    `${isActive ? 'font-semibold bg-base-200 ' : 'font-normal'}`
                  }
                >
                  {route.icon} {route.name}
                  {location.pathname === route.path ? (
                    <span
                      className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary"
                      aria-hidden="true"
                    ></span>
                  ) : null}
                </NavLink>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default LeftSidebar;
