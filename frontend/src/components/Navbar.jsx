import { Link, NavLink, useNavigate } from 'react-router-dom';
import ThemeSwitch from './ThemeSwitch';
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutMutation } from '../slices/usersSlice';
import { logout } from '../slices/authSlice';
import { toast } from 'react-toastify';
import Avatar from './Avatar';
import Bell from './Bell';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const { userInfo } = useSelector((state) => state.auth);

  // log out current user, clear user info from local storage, remove credentials from redux store, and navigate to login page
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/');
      toast.success('Logged out successfully.');
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err?.error);
    }
  };

  return (
    <div className="navbar bg-base-100 top-0 z-50 p-4 w-full ">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            {!userInfo && (
              <>
                <li>
                  <NavLink to="/login">Log in</NavLink>
                </li>

                <li>
                  <button>Register</button>
                  <ul className="p-2">
                    <li>
                      <NavLink to="/register">Detailer</NavLink>
                    </li>
                    <li>
                      <NavLink to="/register">Customer</NavLink>
                    </li>
                  </ul>
                </li>
              </>
            )}
            {userInfo && (
              <li>
                <button onClick={logoutHandler}>Log out</button>
              </li>
            )}
            <li>
              <NavLink to="/contact">Contact Us</NavLink>
            </li>
          </ul>
        </div>
        <NavLink to="/" className="normal-case text-2xl link link-hover ml-5 font-extrabold">
          Rinse
        </NavLink>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>

          {!userInfo && (
            <>
              <li>
                <NavLink to="/login">Log in</NavLink>
              </li>
              <li tabIndex={0}>
                <details>
                  <summary>Register</summary>
                  <ul className="p-2">
                    <li>
                      <NavLink to="/provider/Emily%20Davis">Detailer</NavLink>
                    </li>
                    <li>
                      <NavLink to="/register">Customer</NavLink>
                    </li>
                  </ul>
                </details>
              </li>
            </>
          )}
          {userInfo && (
            <li>
              <button onClick={logoutHandler}>Log out</button>
            </li>
          )}
          <li>
            <NavLink to="/contact">Contact Us</NavLink>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <ThemeSwitch />
        {userInfo && (
          <>
            <Bell />
            <br />
            <Link to={'/dashboard'}>
              <Avatar />
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
