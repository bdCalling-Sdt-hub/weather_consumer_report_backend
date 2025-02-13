import express from 'express';
import { myController } from './controller.template';

const myRouter = express.Router();
myRouter.post('/your-address', myController);
export { myRouter };
