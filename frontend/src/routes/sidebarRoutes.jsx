import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightToBracket,
  faBoltLightning,
  faCodeBranch,
  faDollarSign,
  faGear,
  faInbox,
  faKey,
  faPeopleGroup,
  faTableCells,
  faTableList,
  faUserAlt,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCalendar,
  faChartBar,
  faFile,
  faFileAlt,
  faUser,
} from "@fortawesome/free-regular-svg-icons";

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;

const routes = [
  {
    path: "/welcome",
    icon: (
      <FontAwesomeIcon
        icon={faTableList}
        className={iconClasses}
      />
    ),
    name: "Dashboard",
  },
  {
    path: "/leads", // url
    icon: (
      <FontAwesomeIcon
        icon={faInbox}
        className={iconClasses}
      />
    ),
    name: "Leads", // name that appear in Sidebar
  },
  {
    path: "/transactions", // url
    icon: (
      <FontAwesomeIcon
        icon={faDollarSign}
        className={iconClasses}
      />
    ),
    name: "Transactions", // name that appear in Sidebar
  },
  {
    path: "/charts", // url
    icon: (
      <FontAwesomeIcon
        icon={faChartBar}
        className={iconClasses}
      />
    ),
    name: "Analytics", // name that appear in Sidebar
  },
  {
    path: "/integration", // url
    icon: (
      <FontAwesomeIcon
        icon={faBoltLightning}
        className={iconClasses}
      />
    ),
    name: "Integration", // name that appear in Sidebar
  },
  {
    path: "/calendar", // url
    icon: (
      <FontAwesomeIcon
        icon={faCalendar}
        className={iconClasses}
      />
    ),
    name: "Calendar", // name that appear in Sidebar
  },

  {
    path: "", //no url needed as this has submenu
    icon: (
      <FontAwesomeIcon
        icon={faFile}
        className={iconClasses}
      />
    ),
    name: "Pages", // name that appear in Sidebar
    submenu: [
      {
        path: "/login",
        icon: (
          <FontAwesomeIcon
            icon={faArrowRightToBracket}
            className={submenuIconClasses}
          />
        ),
        name: "Login",
      },
      {
        path: "/register", //url
        icon: (
          <FontAwesomeIcon
            icon={faUser}
            className={submenuIconClasses}
          />
        ),
        name: "Register", // name that appear in Sidebar
      },
      {
        path: "/forgot-password",
        icon: (
          <FontAwesomeIcon
            icon={faKey}
            className={submenuIconClasses}
          />
        ),
        name: "Forgot Password",
      },
    ],
  },
  {
    path: "", //no url needed as this has submenu
    icon: (
      <FontAwesomeIcon
        icon={faGear}
        className={`${iconClasses} inline`}
      />
    ), // icon component
    name: "Settings", // name that appear in Sidebar
    submenu: [
      {
        path: "/settings-profile", //url
        icon: (
          <FontAwesomeIcon
            icon={faUserAlt}
            className={submenuIconClasses}
          />
        ),
        name: "Profile", // name that appear in Sidebar
      },
      {
        path: "/settings-billing",
        icon: (
          <FontAwesomeIcon
            icon={faWallet}
            className={submenuIconClasses}
          />
        ),
        name: "Billing",
      },
      {
        path: "/settings-team", // url
        icon: (
          <FontAwesomeIcon
            icon={faPeopleGroup}
            className={submenuIconClasses}
          />
        ),
        name: "Team Members", // name that appear in Sidebar
      },
    ],
  },
  {
    path: "", //no url needed as this has submenu
    icon: (
      <FontAwesomeIcon
        icon={faFileAlt}
        className={`${iconClasses} inline`}
      />
    ), // icon component    name: "Documentation", // name that appear in Sidebar
    submenu: [
      {
        path: "/getting-started", // url
        icon: (
          <FontAwesomeIcon
            icon={faFile}
            className={submenuIconClasses}
          />
        ),
        name: "Getting Started", // name that appear in Sidebar
      },
      {
        path: "/features",
        icon: (
          <FontAwesomeIcon
            icon={faTableCells}
            className={submenuIconClasses}
          />
        ),
        name: "Features",
      },
      {
        path: "/components",
        icon: (
          <FontAwesomeIcon
            icon={faCodeBranch}
            className={submenuIconClasses}
          />
        ),
        name: "Components",
      },
    ],
  },
];

export default routes;
