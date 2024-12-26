import { Model, Types } from 'mongoose';
import { Role } from '../../middlewares/roles';

export interface INotification {
  _id: Types.ObjectId;
  title: string;
  message: string;
  userId: Types.ObjectId;
  role: Role;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationModal extends Model<INotification> {
    paginate: (query: any, options: any) => Promise<any>;
}