import express from 'express';
import { AdminRoutes } from '../app/modules/admin/admin.routes';
import { AuthRoutes } from '../app/modules/Auth/auth.route';
import { ContactRoutes } from '../app/modules/contact/contact.routes';
import { SettingsRoutes } from '../app/modules/settings/settings.routes';
import { UserRoutes } from '../app/modules/user/user.route';
import { JobRoutes } from '../app/modules/job/job.routes';
import { BidJobRoutes } from '../app/modules/bidJob/bidJob.routes';
import { NotificationRoutes } from '../app/modules/notification/notification.routes';
import { reviewRouter } from '../app/modules/review/route/review.route';
import { adminRouterV2 } from '../app/modules/admin-v2/route/adminV2.route';
import { productRouter } from '../app/modules/products/route/product.route';
import { categoryRouter } from '../app/modules/category/route/category.route';
import { advertisementRouter } from '../app/modules/advertisement/route/advertisement.route';
import { generalInfoRouter } from '../app/modules/general_info/route/generalInfo.model';
const router = express.Router();

const apiRoutes = [
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/admin/v2',
    route: adminRouterV2,
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
    path: '/jobs',
    route: JobRoutes,
  },
  {
    path: '/bid-jobs',
    route: BidJobRoutes,
  },
  {
    path: '/settings',
    route: SettingsRoutes,
  },
  {
    path: '/notifications',
    route: NotificationRoutes,
  },
  {
    path: '/contact',
    route: ContactRoutes,
  },
  { path: '/review', route: reviewRouter },
  {
    path: '/product',
    route: productRouter,
  },
  {
    path: '/category',
    route: categoryRouter,
  },
  {
    path: '/advertisement',
    route: advertisementRouter,
  },
  {
    path: '/general-info',
    route: generalInfoRouter,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
