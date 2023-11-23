import { CALENDAR_EVENT_STYLE } from './util';
import PropTypes from 'prop-types';

const THEME_BG = CALENDAR_EVENT_STYLE;

function CalendarEventsBodyRightDrawer({ filteredEvents }) {
  return (
    <>
      {filteredEvents.map((e, k) => {
        return (
          <div key={k} className={`grid mt-3 card  rounded-box p-3 ${THEME_BG[e.theme] || ''}`}>
            {e.title}
          </div>
        );
      })}
    </>
  );
}

CalendarEventsBodyRightDrawer.propTypes = {
  filteredEvents: PropTypes.array.isRequired,
};

export default CalendarEventsBodyRightDrawer;
