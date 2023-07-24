import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function registerUser() {
    // send req to API
    ev.preventDefault();
    axios.post('/register', {
        name,
        email,
        password
    });
  }

  return (
    <div className='mt-4 grow items-center justify-around'>
      <div className='mt-20'>
        <h1 className='text-4xl text-center mb-4'>Register</h1>
        <form className='max-w-md mx-auto' onSubmit={registerUser}>
          <input
            type='text'
            placeholder='John Doe'
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <input
            type='email'
            placeholder='your@email.com'
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type='password'
            placeholder='password'
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <button className='primary'>Register</button>
          <div className='text-center py-2 text-gray-500'>
            Already a member?{' '}
            <Link to={'/login'} className='underline text-black'>
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
