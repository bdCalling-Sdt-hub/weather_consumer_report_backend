import express from 'express';
import { searchProductController } from '../controller/searchProduct.controller';
import { addProductController } from '../controller/addProduct.controller';
import { removeProductController } from '../controller/removeProduct.controller';
import { getProductDataController } from '../../admin-v2/controller/getProductData.controller';
import { getSingleProductDataController } from '../controller/getProductData.controller';
import { getTop10RatedProductController } from '../controller/getTop10RatedProduct.controller';
import { getTopCategoriesController } from '../controller/getTopCategories.controller';
import { getProductsByCategoryController } from '../controller/getProductDataWithSameCategory.controller';
import { getTopAverageRatedProductController } from '../controller/getTopAverageRatedProduct.controller';
import { getRandomProductsController } from '../controller/getRandomProducts.controller';
import { searchProductBasedOnCriteriaController } from '../controller/searchProductBasedOnCriteria.controller';

const productRouter = express.Router();
productRouter.get('/:id', getSingleProductDataController);
productRouter.get('/search/:search_text', searchProductController);
productRouter.get(
  '/get-product-with-same-category/:categoryName',
  getProductsByCategoryController
);
productRouter.post(
  '/search-product-based-on-criteria',
  searchProductBasedOnCriteriaController
);
productRouter.post('/add', addProductController);
productRouter.delete('/:id', removeProductController);
productRouter.get(
  '/serial/top-10-rated-product',
  getTop10RatedProductController
);
productRouter.get(
  '/serial/top-average-rated-product',
  getTopAverageRatedProductController
);
productRouter.get('/serial/top-categories', getTopCategoriesController);
productRouter.get('/serial/get-random-products', getRandomProductsController);

export { productRouter };
