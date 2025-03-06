import express from 'express';
import { makeReportController } from '../controller/makeReport.controller';
import { getReportDataController } from '../controller/getReportData.controller';
import { acceptOrRejectReportController } from '../controller/acceptOrRejectReport.controller';
import { getSingleReportDataController } from '../controller/getSingleReportedData.controller';

const reportRouter = express.Router();
reportRouter.post('/make-report', makeReportController);
reportRouter.get('/get-report-data', getReportDataController);
reportRouter.get('/get-single-report-data/:id', getSingleReportDataController);
reportRouter.post('/accept-or-reject-report', acceptOrRejectReportController);

export { reportRouter };
