import { PaginateOptions, PaginateResult } from '../../../types/paginate';
import { INotification } from './notification.interface';
import { Notification } from './notification.model';

const addNotification = async (
  payload: INotification
): Promise<INotification> => {
  // Save the notification to the database
  const result = await Notification.create(payload);
  // @ts-ignore
  if (io) {
    // @ts-ignore
    io.to(payload.userId.toString()).emit('notification', result);
  }

  return result;
};

const getAdminNotifications = async (
  filters: Partial<INotification>,
  options: PaginateOptions
): Promise<PaginateResult<INotification>> => {
  filters.role = 'admin';
  return Notification.paginate(filters, options);
};

export const notificationService = {
  addNotification,
};
