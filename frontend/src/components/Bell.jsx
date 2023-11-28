// took this from this website https://codesandbox.io/p/sandbox/notifications-bell-hhmrb?file=%2Fsrc%2Fentry.js%3A17%2C12

import React, { useState, useEffect } from 'react';
// import className from "classnames";

const Bell = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications or establish WS connection here
    // Fake notifications for demonstration
    setNotifications([
      {
        ObjectId: 1,
        title: 'Tenant Process Started',
        startedAt: '04/12/2020 at 2:00pm by Kelly Redd',
        percentage: '64',
      },
      // Add more notifications as needed
    ]);
  }, []); // Empty dependency array to ensure useEffect runs only once

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // const Entry = ({ title, startedAt, percentage }) => (
  //   <li className="process">
  //     <span className="process-title">{title}</span>
  //     <span className="process-started-at">{startedAt}</span>
  //     <span className={className("process-percentage")}>
  //       <span
  //         style={{ width: `${percentage}%` }}
  //         className={className({
  //           incomplete: percentage < 100
  //         })}
  //       >
  //         {percentage}%
  //       </span>
  //     </span>
  //   </li>
  // );

  return (
    <div className='notification-bell'>
      <div className='bell-icon w-7 h-7' onClick={toggleVisibility}>
        <img src='/images/icons/bell-white.png' alt='White Notification Bell' />
        {/* <img src="/images/icons/bell-black.png" alt="Black Notification Bell" /> */}
        {/* <span className="bell-count">{notifications.length}</span> */}
      </div>
      {isVisible && (
        <div className='notification-list'>
          <ul>
            {notifications.map((notification) => (
              <div key={notification.ObjectId}> {notification.title}</div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Bell;
