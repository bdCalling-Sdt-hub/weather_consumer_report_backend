import express from 'express';
import { contactusController } from '../controller/contactus.controller';

const contactUsRouter = express.Router();
contactUsRouter.post('/send-email-to-owner', contactusController);
export { contactUsRouter };
