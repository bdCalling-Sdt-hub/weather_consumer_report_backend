import cron from 'node-cron';
import { Job } from './job.model';
import { errorLogger, logger } from '../../../shared/logger';
import { INotification } from '../notification/notification.interface';
import { NotificationService } from '../notification/notification.services';

const assignTechnicianBasedOnAdminCriteria = () => {
  cron.schedule('* * * * *', async () => {
    logger.info('Cron job started the ar7');
    try {
      const currentDate = new Date();
      const bidSelectionMode = 'max';

      const expiredJobs = await Job.find({
        isAssigned: false,
        jobStatus: 'Pending',
        jobDeadline: { $lt: currentDate },
      }).populate({
        path: 'bidTechnician',
        select: 'technicianId bidPrice',
      });

      for (const job of expiredJobs) {
        if (!job.bidTechnician || job.bidTechnician.length === 0) {
          logger.info(`No bids for job ID: ${job._id}`);
          continue;
        }

        // Find the technician based on admin selection mode
        const selectedBid =
          bidSelectionMode === 'max'
            ? job.bidTechnician.reduce((max, current) =>
                // @ts-ignore
                current.bidPrice > max.bidPrice ? current : max
              )
            : job.bidTechnician.reduce((min, current) =>
                // @ts-ignore
                current.bidPrice < min.bidPrice ? current : min
              );
        if (!selectedBid) {
          logger.info(`No technician selected for job ID: ${job._id}`);
          continue;
        }
        // Assign the technician to the job
        // @ts-ignore
        job.assignedTechnician = selectedBid?.technicianId;
        // @ts-ignore
        job.jobBidPrice = selectedBid?.bidPrice;
        job.isAssigned = true;
        job.assignedTechnicianStatus = 'Pending';
        await job.save();

        // Notify technician about the job assignment
        const technicianEventName = 'technician-notification';
        const technicianNotification: INotification = {
          title: 'Job Assigned to You',
          // @ts-ignore
          receiverId: selectedBid?.technicianId,
          message:
            'You have been assigned a new job. Please check review the details.',
          role: 'technician',
          linkId: job._id,
        };
        await NotificationService.addCustomNotification(
          technicianEventName,
          technicianNotification,
          // @ts-ignore
          selectedBid?.technicianId as string
        );

        //Notify company about the job assignment
        const companyEventName = 'company-notification';
        const companyNotification: INotification = {
          title: 'New Job Assigned',
          // @ts-ignore
          receiverId: job.creatorId,
          message:
            'Your job has been assigned to a technician. Please check review the details.',
          role: 'company',
          linkId: job._id,
        };
        await NotificationService.addCustomNotification(
          companyEventName,
          companyNotification,
          // @ts-ignore
          job.creatorId as string
        );
      }
    } catch (error) {
      errorLogger.error('Error assigning technicians:', error);
      logger.error('Error assigning technicians:', error);
    }
  });
};

export default assignTechnicianBasedOnAdminCriteria;
