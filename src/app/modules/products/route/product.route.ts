import express from 'express';
import { searchProductController } from '../controller/searchProduct.controller';
import { addProductController } from '../controller/addProduct.controller';
import { removeProductController } from '../controller/removeProduct.controller';

const productRouter = express.Router();
productRouter.get('/search/:search_text', searchProductController);
productRouter.post('/add', addProductController);
productRouter.delete('/:id', removeProductController);
export { productRouter };
