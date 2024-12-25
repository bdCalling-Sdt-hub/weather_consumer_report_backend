import express from 'express';
import { AdminRoutes } from '../app/modules/admin/admin.routes';
import { AuthRoutes } from '../app/modules/Auth/auth.route';
import { ContactRoutes } from '../app/modules/contact/contact.routes';
import { OrderRoutes } from '../app/modules/orders/orders.routes';
import { SettingsRoutes } from '../app/modules/settings/settings.routes';
import { UserRoutes } from '../app/modules/user/user.route';
const router = express.Router();

const apiRoutes = [
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/order',
    route: OrderRoutes,
  },
  {
    path: '/settings',
    route: SettingsRoutes,
  },
  {
    path: '/contact',
    route: ContactRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
