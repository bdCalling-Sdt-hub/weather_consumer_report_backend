import express from 'express';
import { getGeneralInfoController } from '../controller/getGeneralInfo.controller';

const generalInfoRouter = express.Router();

generalInfoRouter.get('/', getGeneralInfoController);
generalInfoRouter.get('/:name', getGeneralInfoController);

export { generalInfoRouter };
