import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDollarSign,
  faGear,
  faPeopleGroup,
  faTableList,
  faUserAlt,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;

const routes = [
  {
    path: '/dashboard',
    icon: <FontAwesomeIcon icon={faTableList} className={iconClasses} />,
    name: 'Dashboard',
  },

  {
    path: '/dashboard/transactions', // url
    icon: <FontAwesomeIcon icon={faDollarSign} className={iconClasses} />,
    name: 'Transactions', // name that appear in Sidebar
  },
  {
    path: '/dashboard/calendar', // url
    icon: <FontAwesomeIcon icon={faCalendar} className={iconClasses} />,
    name: 'Calendar', // name that appear in Sidebar
  },
  {
    path: '', //no url needed as this has submenu
    icon: <FontAwesomeIcon icon={faGear} className={`${iconClasses} inline`} />, // icon component
    name: 'Settings', // name that appear in Sidebar
    submenu: [
      {
        path: '/dashboard/settings-profile', //url
        icon: <FontAwesomeIcon icon={faUserAlt} className={submenuIconClasses} />,
        name: 'Profile', // name that appear in Sidebar
      },
      {
        path: '/dashboard/settings-billing',
        icon: <FontAwesomeIcon icon={faWallet} className={submenuIconClasses} />,
        name: 'Billing',
      },
      {
        path: '/dashboard/settings-team', // url
        icon: <FontAwesomeIcon icon={faPeopleGroup} className={submenuIconClasses} />,
        name: 'Team Members', // name that appear in Sidebar
      },
    ],
  },
];

export default routes;
