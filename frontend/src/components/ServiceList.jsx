import React, { useState, useEffect } from 'react'
import Card from './Card'
import '../index.css'

const ServiceList = () => {
  const [users, setUsers] = useState([]);

  async function fetchData() {
    try {
      const response = await fetch('http://localhost:5100/api/users');
      const data = await response.json();

      // Corrected the variable name here
      const filteredUsers = data.filter(current => {
        return current.role === 'provider';
      });

      setUsers(filteredUsers); // Moved this line outside of the filter function
    } catch (err) {
      console.log('Error fetching data:', err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  console.log(users);

  return (
    <div className='services-list max-w-xl'>
      {/* --------Choose a Wash------- */}
      <h1 className='text-3xl lg:text-4xl font-bold'>Choose a Wash</h1>
      {/* -------Recommended--------- */}
      <h2 className='text-3xl font-bold'>Recommended</h2>
      <div className='carousel rounded-box'>
        {users.map(user => (
          <Card
            key={user.id}
            id={user.id}
            name={user.name}
            profileImage={user.services[0].photo}
            altText={user.altText}
            services={user.services[0]}
            reviews={user.reviews}
            serviceArea={user.serviceArea}
          />
        ))}
      </div>
      {/* --------- Best Deals --------- */}
      <h2 className='text-3xl font-bold'>Best Deals</h2>
      <div className='carousel rounded-box'>
        {users.map(user => (
          <Card
            key={user.id}
            profileImage={user.profileImage}
            // altText={user.altText}
            services={user.services[0]}
            reviews={user.reviews}
            serviceArea={user.serviceArea}
          />
        ))}
      </div>
      {/* -------- Quickest ---------- */}
      <h2 className='text-3xl font-bold'>Quickest Service</h2>
      <div className='carousel rounded-box'>
        {users.map(user => (
          <Card
            key={user.id}
            profileImage={user.profileImage}
            altText={user.altText}
            services={user.services[0]}
            reviews={user.reviews}
            serviceArea={user.serviceArea}
          />
        ))}
      </div>
      {/* -------- Quickest ---------- */}
      <h2 className='text-3xl font-bold'>Quickest Service</h2>
      <div className='carousel rounded-box'>
        {users.map(user => (
          <Card
            key={user.id}
            profileImage={user.profileImage}
            altText={user.altText}
            services={user.services[0]}
            reviews={user.reviews}
            serviceArea={user.serviceArea}
          />
        ))}
      </div>
    </div>
  )
}

export default ServiceList