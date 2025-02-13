import express from 'express';
import { searchProductController } from '../controller/searchProduct.controller';
import { addProductController } from '../controller/addProduct.controller';

const productRouter = express.Router();
productRouter.post('/search', searchProductController);
productRouter.post('/add', addProductController);
export { productRouter };
