import { Link } from "react-router-dom";
import ThemeSwitch from "./ThemeSwitch";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label
            tabIndex={0}
            className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
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
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <Link to="/login">Log in</Link>
            </li>
            <li>
              <button>Register</button>
              <ul className="p-2">
                <li>
                  <Link>Detailer</Link>
                </li>
                <li>
                  <Link to="/register">Customer</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/logout">Log out</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>
        <Link
          to="/"
          className="normal-case text-xl">
          Rinse
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link>Log in</Link>
          </li>
          <li tabIndex={0}>
            <details>
              <summary>Register</summary>
              <ul className="p-2">
                <li>
                  <Link>Detailer</Link>
                </li>
                <li>
                  <Link>Customer</Link>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <Link>Log out</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <ThemeSwitch />
      </div>
    </div>
  );
};

export default Navbar;
