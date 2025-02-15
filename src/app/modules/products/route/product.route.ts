import express from 'express';
import { searchProductController } from '../controller/searchProduct.controller';
import { addProductController } from '../controller/addProduct.controller';
import { removeProductController } from '../controller/removeProduct.controller';
import { getProductDataController } from '../../admin-v2/controller/getProductData.controller';
import { getSingleProductDataController } from '../controller/getProductData.controller';

const productRouter = express.Router();
productRouter.get('/:id', getSingleProductDataController);
productRouter.get('/search/:search_text', searchProductController);
productRouter.post('/add', addProductController);
productRouter.delete('/:id', removeProductController);

export { productRouter };
