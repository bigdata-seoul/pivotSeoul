import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';

// User pages
import { Home } from './pages/Home';
import { StageSelection } from './pages/StageSelection';
import { OnboardingYouth } from './pages/OnboardingYouth';
import { OnboardingFamily } from './pages/OnboardingFamily';
import { OnboardingSenior } from './pages/OnboardingSenior';
import { Scenario } from './pages/Scenario';
import { Results } from './pages/Results';

// Admin pages
import { AdminLogin } from './pages/admin-AdminLogin';
import { AdminDashboard } from './pages/admin-AdminDashboard';
import { AdminMonitoring } from './pages/admin-AdminMonitoring';
import { AdminDatasets } from './pages/admin-AdminDatasets';
import { AdminNotices } from './pages/admin-AdminNotices';
import { AdminLogs } from './pages/admin-AdminLogs';
import { AdminAccounts } from './pages/admin-AdminAccounts';

/**
 * Routing policy:
 * - User journey is fixed: Home -> Stage -> Onboarding -> Scenario -> Results
 * - Admin journey is split: login route and authenticated admin layout route
 * - Redirect routes intentionally block invalid direct access paths
 */
export const router = createBrowserRouter([
  // ── User layout ──
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'stage', Component: StageSelection },
      { path: 'onboarding', element: <Navigate to="/stage" replace /> },
      { path: 'onboarding/youth', Component: OnboardingYouth },
      { path: 'onboarding/family', Component: OnboardingFamily },
      { path: 'onboarding/senior', Component: OnboardingSenior },
      { path: 'scenario', Component: Scenario },
      { path: 'results', Component: Results },
    ],
  },

  // ── Admin login (standalone, no layout) ──
  {
    path: '/admin/login',
    Component: AdminLogin,
  },

  // ── Admin layout (requires auth) ──
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: 'monitoring', Component: AdminMonitoring },
      { path: 'datasets', Component: AdminDatasets },
      { path: 'content', element: <Navigate to="/admin" replace /> },
      { path: 'notices', Component: AdminNotices },
      { path: 'logs', Component: AdminLogs },
      { path: 'accounts', Component: AdminAccounts },
    ],
  },
]);
