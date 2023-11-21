import React from "react";
import Card from "./Card";
import "../index.css";
import { sampleUsers } from "../data/users";

const ServiceList = () => {
  const providers = sampleUsers.filter((user) => user.role === "provider");
  console.log(providers);
  return (
    <div className='services-list max-w-xl'>
      {/* --------Choose a Wash------- */}
      <h1 className='text-3xl lg:text-4xl font-bold'>Choose a Wash</h1>
      {/* -------Recommended--------- */}
      <h2 className='text-3xl font-bold'>Recommended</h2>
      <div className='carousel rounded-box'>
        {providers.map((rinser) => (
          <Card
            key={rinser.id}
            id={rinser.id}
            name={rinser.name}
            profileImage={rinser.profileImage}
            altText={rinser.altText}
            services={rinser.services[0]}
            reviews={rinser.reviews}
            serviceArea={rinser.serviceArea}
          />
        ))}
      </div>
      {/* --------- Best Deals --------- */}
      <h2 className='text-3xl font-bold'>Best Deals</h2>
      <div className='carousel rounded-box'>
        {providers.map((rinser) => (
          <Card
            key={rinser.id}
            profileImage={rinser.profileImage}
            // altText={rinser.altText}
            services={rinser.services[0]}
            reviews={rinser.reviews}
            serviceArea={rinser.serviceArea}
          />
        ))}
      </div>
      {/* -------- Quickest ---------- */}
      <h2 className='text-3xl font-bold'>Quickest Service</h2>
      <div className='carousel rounded-box'>
        {providers.map((rinser) => (
          <Card
            key={rinser.id}
            profileImage={rinser.profileImage}
            altText={rinser.altText}
            services={rinser.services[0]}
            reviews={rinser.reviews}
            serviceArea={rinser.serviceArea}
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
