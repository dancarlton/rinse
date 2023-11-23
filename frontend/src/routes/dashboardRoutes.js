// All components mapping with path for internal routes

import { lazy } from 'react';

const Calendar = lazy(() => import('../pages/protected/DashCalendarPage'));
const Team = lazy(() => import('../pages/protected/DashTeamsPage'));
const Transactions = lazy(() => import('../pages/protected/DashTransactionsPage'));
const Bills = lazy(() => import('../pages/protected/DashBillingPage'));
const ProfileSettings = lazy(() => import('../pages/protected/DashProfileSettingsPage'));
const Generic = lazy(() => import('../pages/protected/genericPage'));

const routes = [
  {
    path: '/', // the url
    component: Generic, // view rendered
  },
  {
    path: '/settings-team',
    component: Team,
  },
  {
    path: '/calendar',
    component: Calendar,
  },
  {
    path: '/transactions',
    component: Transactions,
  },
  {
    path: '/settings-profile',
    component: ProfileSettings,
  },
  {
    path: '/settings-billing',
    component: Bills,
  },
];

export default routes;
