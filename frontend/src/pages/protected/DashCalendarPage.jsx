import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../slices/headerSlice';
import { useCalendlyEventListener, InlineWidget } from 'react-calendly';
import axios from 'axios';

/* 
TODO: add conditinonal to see if user has given us their calendly username yet.
If they have not, then we will show a form to ask for it.
If they have, then we will show links to relavent calendly pages such as:
Change your availability: https://calendly.com/app/availability/schedules
Event types: https://calendly.com/event_types/user/me
Scheduled events: https://calendly.com/app/scheduled_events/user/me
Add external calendar (Google, Outlook, etc): https://calendly.com/app/personal/availability/connected_calendars
*/

function Calendar() {
  const dispatch = useDispatch();
  useCalendlyEventListener({
    onProfilePageViewed: () => console.log('onProfilePageViewed'),
    onDateAndTimeSelected: () => console.log('onDateAndTimeSelected'),
    onEventTypeViewed: () => console.log('onEventTypeViewed'),
    onEventScheduled: (e) => console.log(e.data.payload),
  });

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Calendar' }));
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    async function doIt(){
      axios.get('https://api.calendly.com/user_availability_schedules/vguzman812', {
        headers: {
          Authorization: 'Bearer ' + import.meta.env.VITE_, //the token is a variable which holds the token
        },
      });
    }
  }, []);

  return (
    <>
      <div id='calendly-embed'>
        <InlineWidget url='https://calendly.com/vguzman812' />
      </div>{' '}
    </>
  );
}

export default Calendar;
