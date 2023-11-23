import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { useLocalLoginMutation } from '../slices/usersSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    await window.open('http://localhost:5000/api/auth/google', '_self');
  };
  // Fetching login state
  const [login] = useLocalLoginMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to handle form submission
  const handleLocalLogin = async (e) => {
    e.preventDefault();

    try {
      // Attempt to login
      const res = await login({ email, password }).unwrap();

      // Update credentials in local storage
      dispatch(setCredentials({ ...res }));
      // Navigate to home
      navigate('/');
      toast.success('Login Successful');
    } catch (err) {
      // Show error toast if login fails.
      console.error(err);
      toast.error(err.data.message || err.error);
    }
  };

  const handlePasswordVisibility = (event) => {
    event.preventDefault();
    try {
      setPasswordVisible((prev) => !prev);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center  px-6 pb-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          /> */}
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm form-control">
          <form className="space-y-6" action="/" method="POST">
            <div>
              <label htmlFor="email" className="label">
                <span className="label-text">Email address</span>
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="email@example.com"
                  className="input input-bordered w-full block"
                  onChange={({ target }) => setEmail(target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="label">
                  <span className="label-text">Password</span>
                  <button className="mx-3" onClick={handlePasswordVisibility}>
                    {passwordVisible ? (
                      <FontAwesomeIcon icon={faEyeSlash} />
                    ) : (
                      <FontAwesomeIcon icon={faEye} />
                    )}
                  </button>
                </label>
                <div className="label-text-alt">
                  <Link to="/" className="link hover:text-indigo-500">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                {passwordVisible ? (
                  <input
                    id="password"
                    name="password"
                    type="text" // this is difference
                    autoComplete="current-password"
                    placeholder="Enter Password Here"
                    className="input input-bordered w-full block"
                    onChange={({ target }) => setPassword(target.value)}
                  />
                ) : (
                  <input
                    id="password"
                    name="password"
                    type="password" // this is difference
                    autoComplete="current-password"
                    placeholder="Enter Password Here"
                    className="input input-bordered w-full block"
                    onChange={({ target }) => setPassword(target.value)}
                  />
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="btn btn-block btn-primary"
                onClick={handleLocalLogin}
              >
                Sign in
              </button>
            </div>
            <hr />
            <div>
              <button
                type="submit"
                className="btn btn-block btn-secondary"
                onClick={handleGoogleLogin}
              >
                Sign in with{' '}
                <i className="pl-1">
                  <FontAwesomeIcon icon={faGoogle} />
                </i>
              </button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link to="/" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              {' '}
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
