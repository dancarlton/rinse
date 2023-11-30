import React, { useState, useEffect } from 'react';
import Card from './Card';
import '../index.css';

const ServiceList = () => {
  const [users, setUsers] = useState([]);

  async function fetchData() {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();

      // Corrected the variable name here
      const filteredUsers = data.filter((current) => {
        return current.role === 'provider';
      });

      setUsers(filteredUsers);
    } catch (err) {
      console.log('Error fetching data:', err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  console.log(users)

  return (
    <div className='services-list max-w-xl'>
      {/* --------- Vertical Carousel -------- */}
      <div className='h-screen w-screen carousel carousel-vertical rounded-box overflow-y-auto'>
        {/* --------Choose a Wash------- */}
        <h1 className='text-3xl lg:text-4xl font-bold'>Choose a Wash</h1>
        {/* <div className="carousel-item h-full"> */}

        {/* -------Recommended--------- */}
        <h2 className='text-2xl font-bold'>Recommended</h2>
        <div className='carousel rounded-box  carousel-item'>
          {users.map((user) => (
            <Card
              key={user.services[0]._id}
              servicerName={user.name}
              service={user.services[0]}
              numReviews={user.reviews.length}
            />
          ))}
        </div>
        {/* --------- Best Deals --------- */}
        <h2 className='text-2xl font-bold'>Best Deals</h2>
        <div className='carousel rounded-box carousel-item'>
          {users.map((user) => (
            <Card
              key={user.services[0]._id}
              servicerName={user.name}
              service={user.services[0]}
              numReviews={user.reviews.length}
            />
          ))}
        </div>
        {/* -------- Quickest ---------- */}
        <h2 className='text-2xl font-bold'>Quickest Service</h2>
        <div className='carousel rounded-box  carousel-item'>
          {users.map((user) => (
            <Card
              key={user.services[0]._id}
              servicerName={user.name}
              service={user.services[0]}
              numReviews={user.reviews.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceList;
