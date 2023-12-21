import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { useLocalRegisterMutation } from '../slices/usersSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  // form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  // changes password input from password to text and vice versa
  const handlePasswordVisibility = (event) => {
    event.preventDefault();
    try {
      setPasswordVisible((prev) => !prev);
    } catch (e) {
      console.error(e);
    }
  };

  // local register mutation form RTK Query
  const [register] = useLocalRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // handle google login. currently points to backend. need to change for production
  // TODO: change the link here
  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    await window.open('http://localhost:5000/api/auth/google', '_self');
  };

  const handleLocalRegister = async (e) => {
    e.preventDefault();

    // Check for password match
    if (password !== verifyPassword) {
      toast.error('Passwords do not match.');
      return;
    } else {
      try {
        // Attempt to register and set local credentials
        const res = await register({ email, password }).unwrap();
        console.log(res);
        dispatch(setCredentials({ ...res }));
        navigate('/');
        toast.success('Registration Successful. Welcome to the club.');
      } catch (err) {
        console.error(err);
        toast.error(err?.data?.message || err?.error);
      }
    }
  };

  return (
    <>
      <div className='flex min-h-full flex-col justify-center px-6 pb-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          {/* <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          /> */}
          <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight'>
            Register for an account!
          </h2>
        </div>
        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm form-control'>
          <form className='space-y-6' action='/' method='POST'>
            <div>
              <label htmlFor='email' className='label'>
                <span className='label-text'>Email address</span>
              </label>
              <div className='mt-2'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  placeholder='email@example.com'
                  className='input input-bordered w-full block'
                  onChange={({ target }) => setEmail(target.value)}
                />
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between'>
                <label htmlFor='password' className='label'>
                  <span className='label-text'>Password</span>
                  <button className='mx-3' onClick={handlePasswordVisibility}>
                    {passwordVisible ? (
                      <FontAwesomeIcon icon={faEyeSlash} />
                    ) : (
                      <FontAwesomeIcon icon={faEye} />
                    )}
                  </button>
                </label>
              </div>
              <div className='mt-2'>
                {passwordVisible ? (
                  <input
                    id='password'
                    name='password'
                    type='text' // this is difference
                    autoComplete='current-password'
                    placeholder='Enter Password Here'
                    className='input input-bordered w-full block'
                    onChange={({ target }) => setPassword(target.value)}
                  />
                ) : (
                  <input
                    id='password'
                    name='password'
                    type='password' // this is difference
                    autoComplete='current-password'
                    placeholder='Enter Password Here'
                    className='input input-bordered w-full block'
                    onChange={({ target }) => setPassword(target.value)}
                  />
                )}
              </div>
            </div>
            <div>
              <div className='flex items-center justify-between'>
                <label htmlFor='verify-password' className='label'>
                  <span className='label-text'>Verify Password</span>
                  <button className='mx-3' onClick={handlePasswordVisibility}>
                    {passwordVisible ? (
                      <FontAwesomeIcon icon={faEyeSlash} />
                    ) : (
                      <FontAwesomeIcon icon={faEye} />
                    )}
                  </button>
                </label>
              </div>
              <div className='mt-2'>
                {passwordVisible ? (
                  <input
                    id='verify-password'
                    name='verify-password'
                    type='text' // this is difference
                    autoComplete='current-password'
                    placeholder='Retype Password Here'
                    className='input input-bordered w-full block'
                    onChange={({ target }) => setVerifyPassword(target.value)}
                  />
                ) : (
                  <input
                    id='verify-password'
                    name='verify-password'
                    type='password' // this is difference
                    autoComplete='current-password'
                    placeholder='Retype Password Here'
                    className='input input-bordered w-full block'
                    onChange={({ target }) => setVerifyPassword(target.value)}
                  />
                )}
              </div>
            </div>

            <div>
              <button
                type='submit'
                className='btn btn-block btn-primary'
                onClick={handleLocalRegister}
              >
                Register
              </button>
            </div>
            <hr />
            <div>
              <button
                type='submit'
                className='btn btn-block btn-secondary'
                onClick={handleGoogleLogin}
              >
                Register with{' '}
                <i className='pl-1'>
                  <FontAwesomeIcon icon={faGoogle} />
                </i>
              </button>
            </div>
          </form>
          <p className='mt-10 text-center text-sm text-gray-500'>
            Already have an account?{' '}
            <Link
              to='/login'
              className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
            >
              {' '}
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
