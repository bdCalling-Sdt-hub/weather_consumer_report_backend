import { PaginateOptions, PaginateResult } from '../../../types/paginate';
import { IPayment } from './payment.interface';
import { Payment } from './payment.model';
const getAllPayments = async (
  filters: Partial<IPayment>,
  options: PaginateOptions
): Promise<PaginateResult<IPayment>> => {
  options.sortBy = '-createdAt';
  options.populate = [{ path: 'userId', select: 'fullName email image location homeAddress' }];
  const payments = await Payment.paginate(filters, options);
  return payments;
};

export const PaymentService = {
  getAllPayments,
};
