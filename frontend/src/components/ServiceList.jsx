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

  return (
    <div className='services-list w-full'>
      {/* --------- Vertical Carousel -------- */}
      <div className='h-screen w-full carousel carousel-vertical rounded-box overflow-y-auto px-4'>
        {/* --------Choose a Wash------- */}
        <h1 className='text-lg text-center lg:text-3xl lg:text-left font-bold pb-4'>Choose a Wash</h1>
        {/* <div className="carousel-item h-full"> */}


        {/* -------Recommended--------- */}
        <h2 className='text-xl font-bold'>Recommended</h2>
        <div className='rounded-md flex-row py-1'>
          {/* {users.map((user) => (
            <Card
              key={user.services[0]._id}
              servicerName={user.name}
              service={user.services[0]}
              numReviews={user.reviews.length}
            />
          ))} */}
          <Card />
          <Card />
          <Card />
        </div>
        {/* --------- Best Deals --------- */}
        <h2 className='text-xl font-bold'>Best Deals</h2>
        <div className='rounded-md flex-row'>
          {/* {users.map((user) => (
            <Card
              key={user.services[0]._id}
              servicerName={user.name}
              service={user.services[0]}
              numReviews={user.reviews.length}
            />
          ))} */}
          <Card />
          <Card />
          <Card />
        </div>
        {/* -------- Quickest ---------- */}
        <h2 className='text-xl font-bold'>Quickest Service</h2>
        <div className='rounded-md flex-row'>
          {/* {users.map((user) => (
            <Card
              key={user.services[0]._id}
              servicerName={user.name}
              service={user.services[0]}
              numReviews={user.reviews.length}
            />
          ))} */}
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </div>
  );
};

export default ServiceList;
